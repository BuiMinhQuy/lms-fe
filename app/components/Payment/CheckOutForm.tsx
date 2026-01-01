import { styles } from "@/app/styles/style";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { useCreateOrderMutation } from "@/redux/features/orders/ordersApi";
import { LinkAuthenticationElement, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { redirect } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import io from 'socket.io-client';
const ENDPOINT = "http://localhost:8000";
const socket = io("ws://localhost:8000", {
    transports: ["websocket"],
  });
type Props = {
    setOpen: any;
    data: any;
    user:any;
};

const CheckOutForm = ({ setOpen, data,user }: Props) => {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState<any>("");
    const [createOrder, { data: orderData, error }] = useCreateOrderMutation();
    const [loadUser, setLoadUser] = useState(false);
    const {} = useLoadUserQuery({ skip: loadUser ? false : true });
    const [isLoading, setIsLoading] = useState(false);
    const [isSucceeded, setIsSucceeded] = useState(false);
    const hasCreatedOrderRef = useRef(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!stripe || !elements) {
            return;
        }
        // Block re-payment attempts for the same course in this session
        const paidKey = `paid:${data?._id}`;
        if (sessionStorage.getItem(paidKey)) {
            setIsSucceeded(true);
            setMessage("Payment already completed.");
            return;
        }
        if (isSucceeded || hasCreatedOrderRef.current) {
            return;
        }
        setIsLoading(true);
        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: "if_required",
        });
        if (error) {
            setMessage(error.message);
            setIsLoading(false);
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
            setIsLoading(false);
            setIsSucceeded(true);
            try {
                sessionStorage.setItem(paidKey, paymentIntent.id);
            } catch {}
            if (!hasCreatedOrderRef.current) {
                hasCreatedOrderRef.current = true;
                createOrder({ courseId: data._id, payment_info: paymentIntent });
            }
        }
    };

    // Avoid reconfirming an already-succeeded PaymentIntent
    useEffect(() => {
        if (!stripe) return;
        const clientSecret = new URLSearchParams(window.location.search).get(
            "payment_intent_client_secret"
        );
        if (!clientSecret) return;

        let cancelled = false;
        (async () => {
            const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);
            if (cancelled || !paymentIntent) return;
            if (paymentIntent.status === "succeeded") {
                setIsSucceeded(true);
                setMessage("Payment succeeded");
                try {
                    sessionStorage.setItem(`paid:${data?._id}`, paymentIntent.id);
                } catch {}
                if (!hasCreatedOrderRef.current) {
                    hasCreatedOrderRef.current = true;
                    createOrder({ courseId: data._id, payment_info: paymentIntent });
                }
            } else if (paymentIntent.status === "processing") {
                setMessage("Your payment is processing.");
            } else if (paymentIntent.status === "requires_payment_method") {
                setMessage("Your payment was not successful, please try again.");
            } else {
                setMessage("Something went wrong.");
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [stripe]);
    useEffect(() => {
        if (orderData) {
            setLoadUser(true);
            socket.emit("notification",{
                title:"New Order",
                message:`You have a new order form ${data?.name}`,
                userId: user._id
            })
            redirect(`/course-access/${data._id}`);
        }
        if (error) {
            if ("data" in error) {
                const errorMessage = error as any;
                toast.error(errorMessage.data.message);
            }
        }
    }, [orderData, error]);
    return (
        <form id="payment-form" onSubmit={handleSubmit}>
            <LinkAuthenticationElement id="link-authentication-element" />
            <PaymentElement id="payment-element" />
            <button disabled={isLoading || !stripe || !elements || isSucceeded} id="submit">
                <span id="button-text" className={`${styles.button} mt-2 !h-[35px]`}>
                    {isSucceeded ? "Paid" : isLoading ? "Paying..." : "Pay now"}
                </span>
            </button>
            {/*Show any error or success messages*/}
            {message && <div id="payment-message" className="font-Poppins pt-2">{message}</div>}
        </form>
    );
};

export default CheckOutForm;

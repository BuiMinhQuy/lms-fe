"use client";
import { useGetCourseDetailsQuery } from "@/redux/features/courses/coursesApi";
import React, { useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import Heading from "@/app/utils/Heading";
import CourseDetails from "./CourseDetails";
import Header from "../Header";
import { useCreatePaymentIntentMutation, useGetStripePublishablekeyQuery } from "@/redux/features/orders/ordersApi";
import { loadStripe } from "@stripe/stripe-js";
type Props = {
    id: string;
};

const CourseDetailsPage = ({ id }: Props) => {
    const [route, setRoute] = useState("Login");
    const [open, setOpen] = useState(false);
    const { data, isLoading } = useGetCourseDetailsQuery(id);
    const { data: config } = useGetStripePublishablekeyQuery({});
    const [createPaymenIntent, { data: paymentIntentData }] = useCreatePaymentIntentMutation();
    const [stripePromise, setStripePromise] = useState<any>("");
    const [clientSecret, setClientSecret] = useState("");

    useEffect(() => {
        if (config) {
            const publishableKey = config?.publishablekey;
            // console.log('config',config);
            //console.log('publishableKey',publishableKey);
            //console.log('loadStripe(publishableKey)',loadStripe(publishableKey));

            setStripePromise(loadStripe(publishableKey));
        }
        if (data) {
            // console.log('data',data.course);

            const amount = Math.round(data.course.price * 100);
            createPaymenIntent(amount);
        }
    }, [config, data]);
    useEffect(() => {
        if (paymentIntentData) {
            setClientSecret(paymentIntentData?.client_secret);
        }
    }, [paymentIntentData]);
    // console.log('clientSecret',clientSecret);
    //console.log('stripePromise',stripePromise)

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <div>
                    <Heading
                        title={data?.course?.name + "- ELearning"}
                        description={
                            "Elearning is programming comminity which is developed by NAMNPHfor helping programmers"
                        }
                        keywords={data?.course?.tags}
                    />
                    <Header open={open} route={route} setRoute={setRoute} setOpen={setOpen} activeItem={1} />
                    {stripePromise && (
                        <CourseDetails
                            setRoute={setRoute}
                            setOpen={setOpen}
                            data={data.course}
                            stripePromise={stripePromise}
                            clientSecret={clientSecret}
                        />
                    )}
                </div>
            )}
        </>
    );
};

export default CourseDetailsPage;

"use client";
import { styles } from "@/app/styles/style";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import {
    useCreatePayOSPaymentMutation,
    useLazyCheckPayOSStatusQuery,
} from "@/redux/features/orders/ordersApi";
import { formatVND } from "@/app/utils/formatCurrency";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { useRouter } from "next/navigation";
import socket, { joinUserRoom, onPaymentSuccess } from "@/app/utils/socket";

type Props = {
    setOpen: any;
    data: any;
    user: any;
};

type PaymentData = {
    qrCode: string;
    checkoutUrl: string;
    orderCode: number;
    amount: number;
    description: string;
    expiredAt: number;
    qrImageUrl: string;
};

const PayOSPaymentForm = ({ setOpen, data, user }: Props) => {
    const router = useRouter();
    const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSucceeded, setIsSucceeded] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState<number>(0);
    const [createPayment, { data: paymentResponse, error: paymentError }] =
        useCreatePayOSPaymentMutation();
    const [checkStatus, { data: statusData }] = useLazyCheckPayOSStatusQuery();
    const [loadUser, setLoadUser] = useState(false);
    const {} = useLoadUserQuery({ skip: loadUser ? false : true });
    const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const hasProcessedPaymentRef = useRef(false);

    // Stop polling
    const stopPolling = React.useCallback(() => {
        if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
        }
    }, []);

    // Handle payment success from socket
    const handlePaymentSuccess = React.useCallback(
        (socketData: any) => {
            if (hasProcessedPaymentRef.current) return;

            // Verify orderCode matches
            if (
                socketData.orderCode &&
                paymentData?.orderCode &&
                socketData.orderCode === paymentData.orderCode
            ) {
                hasProcessedPaymentRef.current = true;
                setIsSucceeded(true);
                stopPolling();
                setLoadUser(true);

                toast.success(socketData.message || "Thanh toán thành công!");

                // Redirect after a short delay
                setTimeout(() => {
                    setOpen(false);
                    router.push(`/course-access/${data._id}`);
                }, 2000);
            }
        },
        [paymentData, data, router, setOpen, stopPolling]
    );

    // Start polling for payment status
    const startPolling = React.useCallback(
        (orderCode: number) => {
            // Clear any existing polling
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
                pollingIntervalRef.current = null;
            }

            // Poll every 3 seconds
            pollingIntervalRef.current = setInterval(() => {
                if (!isSucceeded && timeRemaining > 0) {
                    checkStatus(orderCode);
                }
            }, 3000);
        },
        [isSucceeded, timeRemaining, checkStatus]
    );

    // Create payment when component mounts
    useEffect(() => {
        if (data?._id && !paymentData && !isSucceeded) {
            setIsLoading(true);
            createPayment({
                courseId: data._id,
                amount: Math.round(data.price), // Amount in VND
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data?._id]);

    // Handle payment creation response
    useEffect(() => {
        if (paymentResponse?.success && paymentResponse?.data) {
            setPaymentData(paymentResponse.data);
            setIsLoading(false);

            // Join user room for socket notifications
            if (user?._id) {
                joinUserRoom(user._id);
            }

            // Start polling for payment status
            if (paymentResponse.data.orderCode) {
                startPolling(paymentResponse.data.orderCode);
            }

            // Set up socket listener
            const cleanup = onPaymentSuccess(handlePaymentSuccess);
            return cleanup;
        }

        if (paymentError) {
            setIsLoading(false);
            if ("data" in paymentError) {
                const errorMessage = paymentError as any;
                toast.error(errorMessage.data?.message || "Có lỗi xảy ra khi tạo thanh toán");
            } else {
                toast.error("Có lỗi xảy ra khi tạo thanh toán");
            }
        }
    }, [paymentResponse, paymentError, user, startPolling, handlePaymentSuccess]);

    // Calculate time remaining
    useEffect(() => {
        if (!paymentData?.expiredAt) return;

        const updateTimeRemaining = () => {
            const now = Math.floor(Date.now() / 1000);
            const remaining = paymentData.expiredAt - now;
            setTimeRemaining(Math.max(0, remaining));

            if (remaining <= 0 && !isSucceeded) {
                if (pollingIntervalRef.current) {
                    clearInterval(pollingIntervalRef.current);
                    pollingIntervalRef.current = null;
                }
                toast.error("Thời gian thanh toán đã hết hạn");
            }
        };

        updateTimeRemaining();
        const interval = setInterval(updateTimeRemaining, 1000);

        return () => clearInterval(interval);
    }, [paymentData, isSucceeded]);


    // Handle status check response
    useEffect(() => {
        if (statusData?.success && statusData?.data) {
            const { status } = statusData.data;

            if (status === "PAID" && !hasProcessedPaymentRef.current) {
                hasProcessedPaymentRef.current = true;
                setIsSucceeded(true);
                stopPolling();
                setLoadUser(true);

                toast.success("Thanh toán thành công!");

                setTimeout(() => {
                    setOpen(false);
                    router.push(`/course-access/${data._id}`);
                }, 2000);
            }
        }
    }, [statusData, stopPolling, setOpen, router, data]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopPolling();
        };
    }, [stopPolling]);

    // Format time remaining
    const formatTimeRemaining = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    // Open checkout URL in new window
    const handleOpenCheckoutUrl = () => {
        if (paymentData?.checkoutUrl) {
            window.open(paymentData.checkoutUrl, "_blank");
        }
    };

    return (
        <div className="w-full">
            {isLoading && (
                <div className="flex flex-col items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-crimson mb-4"></div>
                    <p className="text-black dark:text-white">Đang tạo yêu cầu thanh toán...</p>
                </div>
            )}

            {paymentData && !isSucceeded && (
                <div className="flex flex-col items-center py-4">
                    <h2 className="text-2xl font-Poppins font-bold text-black dark:text-white mb-4">
                        Thanh toán qua PayOS
                    </h2>

                    <div className="mb-4 text-center">
                        <p className="text-lg font-Poppins text-black dark:text-white">
                            Số tiền: <span className="font-bold text-crimson">{formatVND(paymentData.amount)}</span>
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {paymentData.description}
                        </p>
                    </div>

                    {/* QR Code */}
                    <div className="mb-4 p-4 bg-white rounded-lg shadow-lg">
                        {paymentData.qrImageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={paymentData.qrImageUrl}
                                alt="QR Code"
                                width={250}
                                height={250}
                                className="rounded mx-auto"
                            />
                        ) : (
                            <div className="w-[250px] h-[250px] flex items-center justify-center bg-gray-100 rounded">
                                <p className="text-gray-500">Đang tải QR code...</p>
                            </div>
                        )}
                    </div>

                    {/* Time remaining */}
                    {timeRemaining > 0 && (
                        <div className="mb-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Thời gian còn lại:{" "}
                                <span
                                    className={`font-bold ${
                                        timeRemaining < 60 ? "text-red-500" : "text-black dark:text-white"
                                    }`}
                                >
                                    {formatTimeRemaining(timeRemaining)}
                                </span>
                            </p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col gap-3 w-full max-w-sm">
                        <button
                            onClick={handleOpenCheckoutUrl}
                            className={`${styles.button} !w-full !h-[45px] font-Poppins cursor-pointer !bg-[#4285f4] hover:!bg-[#357ae8]`}
                        >
                            Mở trang thanh toán
                        </button>

                        <button
                            onClick={() => {
                                stopPolling();
                                setOpen(false);
                            }}
                            className={`${styles.button} !w-full !h-[40px] font-Poppins cursor-pointer !bg-gray-500 hover:!bg-gray-600`}
                        >
                            Hủy
                        </button>
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
                        Quét QR code bằng ứng dụng ngân hàng của bạn hoặc nhấn &quot;Mở trang thanh toán&quot;
                    </p>
                </div>
            )}

            {isSucceeded && (
                <div className="flex flex-col items-center justify-center py-8">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
                        <svg
                            className="w-8 h-8 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                    <p className="text-xl font-Poppins font-bold text-green-600 dark:text-green-400 mb-2">
                        Thanh toán thành công!
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Đang chuyển hướng đến khóa học...
                    </p>
                </div>
            )}
        </div>
    );
};

export default PayOSPaymentForm;


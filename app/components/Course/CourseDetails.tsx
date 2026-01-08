import { styles } from "@/app/styles/style";
import CoursePlayer from "@/app/utils/CoursePlayer";
import Ratings from "@/app/utils/Ratings";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IoMdCheckmarkCircleOutline, IoMdCloseCircleOutline } from "react-icons/io";
import { useSelector } from "react-redux";
import { format } from "timeago.js";
import CourseContentList from "./CourseContentList";
import PayOSPaymentForm from "../Payment/PayOSPaymentForm";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { formatVND } from "@/app/utils/formatCurrency";
import { useTranslation } from "react-i18next";
type Props = {
    data: any;
    setRoute: any;
    setOpen: any;
};

const CourseDetails = ({ data, setRoute, setOpen: openAuthModal }: Props) => {
    const { t } = useTranslation();
    const { data: userData } = useLoadUserQuery(undefined, {});
    const discountPercentenge = ((data?.estimatedPrice - data.price) / data.estimatedPrice) * 100;
    const [open, setOpen] = useState(false);
    const discountPercentengePrice = discountPercentenge.toFixed(0);
    const [isPurchased, setIsPurchased] = useState(false);
    const [user, setUser] = useState<any>();
    useEffect(() => {
        setUser(userData?.user);
    }, [userData]);
    const handleOrder = (e: any) => {
        if (user) {
            setOpen(true);
        } else {
            setRoute("Login");
            openAuthModal(true);
        }
    };
    // console.log('stripePromise',stripePromise);
    // console.log('clientSecret',clientSecret)
    useEffect(() => {
        const isPurchased = user && user?.courses?.find((item: any) => item._id === data._id);
        setIsPurchased(isPurchased);
    }, [user]);
   // console.log("data", data);
   // console.log("user", user);
   // console.log("isPurchased", isPurchased);
    return (
        <div className="min-h-screen bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-black">
            <div className="w-[90%] 800px:w-[90%] m-auto py-5">
                <div className="w-full flex flex-col-reverse 800px:flex-row">
                    <div className="w-full 800px:w-[65%] 800px:pr-5">
                        <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">{data.name}</h1>
                        <div className="flex items-center justify-between pt-3">
                            <div className="flex items-center">
                                <Ratings rating={data.ratings} />
                                <h5 className="text-black dark:text-white">{data.reviews?.length} {t("reviews")}</h5>
                            </div>
                            <h5 className="text-black dark:text-white">{data.purchased} {t("students")}</h5>
                        </div>
                        <br />
                        <div>
                            <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
                                {t("what-learn")}
                            </h1>
                            {data.benefits?.map((item: any, index: number) => (
                                <div className="w-full flex 800px:items-center py-2" key={index}>
                                    <div className="w-[15px] mr-1">
                                        <IoMdCheckmarkCircleOutline size={20} className="text-black dark:text-white" />
                                    </div>
                                    <p className="pl-2 text-black dark:text-white">{item.title}</p>
                                </div>
                            ))}
                            <br />

                            <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
                                {t("what-are-prerequisites")}
                            </h1>
                            {data.prerequisites?.map((item: any, index: number) => (
                                <div className="w-full flex 800px:items-center py-2" key={index}>
                                    <div className="w-[15px] mr-1">
                                        <IoMdCheckmarkCircleOutline size={20} className="text-black dark:text-white" />
                                    </div>
                                    <p className="pl-2 text-black dark:text-white">{item.title}</p>
                                </div>
                            ))}

                            <br />
                            <br />
                            <div className="w-full">
                                <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
                                    {t("course-overview")}
                                </h1>
                                <CourseContentList data={data?.courseData} isDemo={true} activeVideo={0} />
                            </div>
                            <br />
                            <br />
                            <div className="w-full">
                                <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
                                    {t("course-details")}
                                </h1>
                                <p className="text-[18px] mt-[20px] whitespace-pre-line w-full overflow-hidden text-black dark:text-white">
                                    {data.description}
                                </p>
                            </div>
                            <br />
                            <br />
                            <div className="w-full">
                                <div className="800px:flex items-center">
                                    <Ratings rating={data?.ratings} />
                                    <h5 className="text-[25px] font-Poppins text-black dark:text-white">
                                        {Number.isInteger(data?.ratings)
                                            ? data?.ratings.toFixed(1)
                                            : data?.ratings.toFixed(2)}{" "}
                                        {t("course-rating")} {data?.reviews.length} {t("reviews")}
                                    </h5>
                                </div>
                                <br />
                                {(data?.reviews && [...data.reviews].reverse()).map((item: any, index: number) => (
                                    <div className="w-full pb=4" key={index}>
                                        <div className="flex">
                                            <div className="w-[50px] h-[50px]">
                                                <div className="w-[50px] h-[50px] bg-slate-600 rounded-[50px] flex items-center justify-center cursor-pointer">
                                                    <h1 className="uppercase text-[18px] text-black dark:text-white">
                                                        {item.user.name.slice(0, 2)}
                                                    </h1>
                                                </div>
                                            </div>
                                            <div className="hidden 800px:block pl-2">
                                                <div className="flex items-center">
                                                    <h5 className="text-[18px] pr-2 text-black dark:text-white">
                                                        {item.user.name}
                                                    </h5>
                                                    <Ratings rating={item.rating} />
                                                </div>
                                                <p className="text-black dark:text-white">{item.comment}</p>
                                                <small className="text-[#000000d1] dark:text-[#ffffff83]">
                                                    {format(item.createdAt)}
                                                </small>
                                            </div>
                                            <div className="pl-2 flex 800px:hidden items-center">
                                                <h5 className="text-[18px] pr-2 text-black dark:text-white">
                                                    {item.user.name}
                                                </h5>
                                                <Ratings rating={item.rating} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="w-full 800px:w-[35%] relative ">
                        <div className="sticky top-[100px] left-0 z-50 w-full">
                            <CoursePlayer videoUrl={data.demoUrl} title={data.title} />
                            <div className="flex items-center">
                                <h1 className="pt-5 text-[25px] text-black dark:text-white">
                                    {data.price === 0 ? t("free") : formatVND(data.price)}
                                </h1>
                                <h5 className="pl-3 text-[20px] mt-2 line-through opacity-80 text-black dark:text-white">
                                    {formatVND(data.estimatedPrice)}
                                </h5>
                                <h4 className="pl-5 pt-4 text-[22px] text-black dark:text-white">
                                    {discountPercentenge}% {t("off")}
                                </h4>
                            </div>
                            <div className="flex items-center">
                                {isPurchased ? (
                                    <Link
                                        className={`${styles.button} !w-[180px] my-3 font-Poppins cursor-pointer !bg-[crimson]`}
                                        href={`/course-access/${data._id}`}
                                    >
                                        {t("enter-to-course")}
                                    </Link>
                                ) : (
                                    <button
                                        className={`${styles.button} !w-[180px] my-3 font-Poppins cursor-pointer !bg-[crimson]`}
                                        onClick={handleOrder}
                                    >
                                        {t("buy-now")}
                                    </button>
                                )}
                            </div>
                            <br />
                            <p className="pb-1 text-black dark:text-white">{t("source-code-included")}</p>
                            <p className="pb-1 text-black dark:text-white">{t("lifetime-access")}</p>
                            <p className="pb-1 text-black dark:text-white">{t("certificate")}</p>
                            <p className="pb-3 800px:pb-1 text-black dark:text-white">{t("premium-support")}</p>
                        </div>
                    </div>
                </div>
            </div>
            <>
                {open && (
                    <div className="w-full h-screen bg-[#00000036] fixed top-0 left-0 z-50 flex items-center justify-center">
                        <div className="w-[90%] max-w-[500px] min-h-[500px] bg-white dark:bg-gray-800 rounded-xl shadow p-6 relative">
                            <div className="w-full flex justify-end absolute top-4 right-4">
                                <IoMdCloseCircleOutline
                                    size={40}
                                    className="text-black dark:text-white cursor-pointer hover:text-crimson"
                                    onClick={() => setOpen(false)}
                                />
                            </div>
                            <div className="w-full pt-8">
                                <PayOSPaymentForm setOpen={setOpen} data={data} user={user} />
                            </div>
                        </div>
                    </div>
                )}
            </>
        </div>
    );
};

export default CourseDetails;

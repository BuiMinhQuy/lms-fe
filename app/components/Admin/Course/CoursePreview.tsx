import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import CoursePlayer from "./CoursePlayer";
import { styles } from "@/app/styles/style";
import Ratings from "@/app/utils/Ratings";
import { IoIosCheckmarkCircle } from "react-icons/io";

type Props = {
    active: number;
    setActive: (active: number) => void;
    courseData: any;
    handleCourseCreate: any;
    isEdit?: boolean;
};

const CoursePreview: FC<Props> = ({ courseData, handleCourseCreate, setActive, active, isEdit }) => {
    const { t } = useTranslation();
    const discountPercentage = ((courseData?.estimatedPrice - courseData?.price) / courseData?.estimatedPrice) * 100;

    const discountPercentagePrice = discountPercentage.toFixed(0);
    const prevButton = () => {
        setActive(active - 1);
    };
    const createCourse = () => {
        handleCourseCreate();
    };
    return (
        <div className="w-[90%] m-auto py-5 mb-5">
            <div className="w-full relative">
                <div className="w-full mt-10">
                    <CoursePlayer videoUrl={courseData?.demoUrl} title={courseData?.title} />
                </div>
                <div className="flex items-center">
                    <h1 className="pt-5 text-[25px]">{courseData?.price === 0 ? t("free") : courseData?.price + "$"}</h1>
                    <h5 className="pl-3 text-[20px] mt-2 line-through opacity-80">{courseData?.estimatedPrice}$</h5>
                    <h4 className="pl-5 pt-4 text-[22px]">{discountPercentage}% {t("off")}</h4>
                </div>
                <div className="flex items-center">
                    <div className={`${styles.button} !w-[180px] my-3 font-Poppins !bg-[crimson] cursor-not-allowed`}>
                        {t("buy-now")} {courseData.price}
                    </div>
                </div>
                <div className="flex items-center">
                    <input
                        type="text"
                        name=""
                        id=""
                        placeholder={t("discount-code")}
                        className={`${styles.input} !w-[50%] ml-3 !mt-0`}
                    />
                    <div className={`${styles.button} !w-[120px] my-3 ml-4 font-Poppins cursor-pointer`}>{t("apply")}</div>
                </div>
                <p className="pb-1">{t("source-code-included")}</p>
                <p className="pb-1">{t("lifetime-access")}</p>
                <p className="pb-1">{t("certificate")}</p>
                <p className="pb-1 800px:pb-1">{t("premium-support")}</p>
            </div>
            <div className="w-full">
                <div className="w-full 800px:pr-5">
                    <h1 className="text-[25px] font-Poppins font-[600]">{courseData?.name}</h1>
                    <div className="flex items-center justify-between pt-3">
                        <div className="flex items-center">
                            <Ratings rating={4.4} />
                            <h5>0 {t("reviews")}</h5>
                        </div>
                        <h5>0 {t("students")}</h5>
                    </div>
                    <br />
                    <h1 className="text-[25px] font-Poppins font-[600]">{t("what-learn")}</h1>
                </div>
                {courseData?.benefits?.map((item: any, index: number) => (
                    <div className="w-full flex 800px:items-center py-2" key={index}>
                        <div className="w-[15px] mr-1">
                            <IoIosCheckmarkCircle size={20} />
                        </div>
                        <p className="pl-2">{item.title}</p>
                    </div>
                ))}
                <br />
                <br />
                {/* //course description */}
                <div className="w-full">
                    <h1 className="text-[25px] font-Poppins font-[600]">{t("course-details")}</h1>

                    {courseData?.description}
                </div>
            </div>

            <br />

            <div className="w-full flex items-center justify-between">
                <div
                    className="w-full 800px:w-[180px] flex items-center justify-center h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-8 cursor-pointer"
                    onClick={() => prevButton()}
                >
                    {t("previous")}
                </div>
                <div
                    className="w-full 800px:w-[180px] flex items-center justify-center h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-8 cursor-pointer"
                    onClick={() => createCourse()}
                >
                    {t("next")}
                </div>
            </div>
        </div>
    );
};

export default CoursePreview;

"use client";
import React from "react";
import { useTranslation } from "react-i18next";
import { styles } from "../styles/style";

type Props = {};

const Policy = (props: Props) => {
    const { t } = useTranslation();

    return (
        <div className="w-full">
            <div className="w-[95%] 800px:w-[92%] m-auto py-2 text-black dark:text-white px-3">
                <h1 className={`${styles.title} !text-start pt-2 800px:text-[40px]`}>
                    {t("policy-title")}
                </h1>
                <div className="mt-8 pb-12">
                    <div className="space-y-6">
                        <p className="text-[18px] font-Poppins leading-relaxed">
                            {t("policy-intro")}
                        </p>

                        <div className="mt-6">
                            <h2 className="text-[22px] font-Poppins font-semibold mb-3 text-black dark:text-white">
                                {t("policy-section1-title")}
                            </h2>
                            <p className="text-[16px] font-Poppins leading-relaxed text-gray-700 dark:text-gray-300">
                                {t("policy-section1-content")}
                            </p>
                        </div>

                        <div className="mt-6">
                            <h2 className="text-[22px] font-Poppins font-semibold mb-3 text-black dark:text-white">
                                {t("policy-section2-title")}
                            </h2>
                            <p className="text-[16px] font-Poppins leading-relaxed text-gray-700 dark:text-gray-300">
                                {t("policy-section2-content")}
                            </p>
                        </div>

                        <div className="mt-6">
                            <h2 className="text-[22px] font-Poppins font-semibold mb-3 text-black dark:text-white">
                                {t("policy-section3-title")}
                            </h2>
                            <p className="text-[16px] font-Poppins leading-relaxed text-gray-700 dark:text-gray-300">
                                {t("policy-section3-content")}
                            </p>
                        </div>

                        <div className="mt-6">
                            <h2 className="text-[22px] font-Poppins font-semibold mb-3 text-black dark:text-white">
                                {t("policy-section4-title")}
                            </h2>
                            <p className="text-[16px] font-Poppins leading-relaxed text-gray-700 dark:text-gray-300">
                                {t("policy-section4-content")}
                            </p>
                        </div>

                        <div className="mt-6">
                            <h2 className="text-[22px] font-Poppins font-semibold mb-3 text-black dark:text-white">
                                {t("policy-section5-title")}
                            </h2>
                            <p className="text-[16px] font-Poppins leading-relaxed text-gray-700 dark:text-gray-300">
                                {t("policy-section5-content")}
                            </p>
                        </div>

                        <div className="mt-6">
                            <h2 className="text-[22px] font-Poppins font-semibold mb-3 text-black dark:text-white">
                                {t("policy-section6-title")}
                            </h2>
                            <p className="text-[16px] font-Poppins leading-relaxed text-gray-700 dark:text-gray-300">
                                {t("policy-section6-content")}
                            </p>
                        </div>

                        <div className="mt-6">
                            <h2 className="text-[22px] font-Poppins font-semibold mb-3 text-black dark:text-white">
                                {t("policy-section7-title")}
                            </h2>
                            <p className="text-[16px] font-Poppins leading-relaxed text-gray-700 dark:text-gray-300">
                                {t("policy-section7-content")}
                            </p>
                        </div>

                        <div className="mt-6">
                            <h2 className="text-[22px] font-Poppins font-semibold mb-3 text-black dark:text-white">
                                {t("policy-section8-title")}
                            </h2>
                            <p className="text-[16px] font-Poppins leading-relaxed text-gray-700 dark:text-gray-300">
                                {t("policy-section8-content")}
                            </p>
                        </div>

                        <div className="mt-6">
                            <h2 className="text-[22px] font-Poppins font-semibold mb-3 text-black dark:text-white">
                                {t("policy-section9-title")}
                            </h2>
                            <p className="text-[16px] font-Poppins leading-relaxed text-gray-700 dark:text-gray-300">
                                {t("policy-section9-content")}
                            </p>
                        </div>

                        <div className="mt-6">
                            <h2 className="text-[22px] font-Poppins font-semibold mb-3 text-black dark:text-white">
                                {t("policy-section10-title")}
                            </h2>
                            <p className="text-[16px] font-Poppins leading-relaxed text-gray-700 dark:text-gray-300">
                                {t("policy-section10-content")}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Policy;

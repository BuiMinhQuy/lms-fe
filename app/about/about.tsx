"use client";
import React from "react";
import { useTranslation } from "react-i18next";
import { styles } from "../styles/style";

type Props = {};

const About = (props: Props) => {
    const { t } = useTranslation();

    return (
        <div className="text-black dark:text-white min-h-screen">
            <div className="w-[95%] 800px:w-[92%] m-auto py-2 px-3">
                <h1 className={`${styles.title} !text-start pt-2 800px:text-[40px]`}>
                    {t("about-title")}
                </h1>
                <div className="mt-8 pb-12 space-y-6">
                    <p className="text-[18px] font-Poppins leading-relaxed">
                        {t("about-intro")}
                    </p>

                    <div className="mt-6">
                        <h2 className="text-[22px] font-Poppins font-semibold mb-3 text-black dark:text-white">
                            {t("about-section1-title")}
                        </h2>
                        <p className="text-[16px] font-Poppins leading-relaxed text-gray-700 dark:text-gray-300">
                            {t("about-section1-content")}
                        </p>
                    </div>

                    <div className="mt-6">
                        <h2 className="text-[22px] font-Poppins font-semibold mb-3 text-black dark:text-white">
                            {t("about-section2-title")}
                        </h2>
                        <p className="text-[16px] font-Poppins leading-relaxed text-gray-700 dark:text-gray-300">
                            {t("about-section2-content")}
                        </p>
                    </div>

                    <div className="mt-6">
                        <h2 className="text-[22px] font-Poppins font-semibold mb-3 text-black dark:text-white">
                            {t("about-section3-title")}
                        </h2>
                        <p className="text-[16px] font-Poppins leading-relaxed text-gray-700 dark:text-gray-300">
                            {t("about-section3-content")}
                        </p>
                    </div>

                    <div className="mt-6">
                        <h2 className="text-[22px] font-Poppins font-semibold mb-3 text-black dark:text-white">
                            {t("about-section4-title")}
                        </h2>
                        <p className="text-[16px] font-Poppins leading-relaxed text-gray-700 dark:text-gray-300">
                            {t("about-section4-content")}
                        </p>
                    </div>

                    <div className="mt-6">
                        <h2 className="text-[22px] font-Poppins font-semibold mb-3 text-black dark:text-white">
                            {t("about-section5-title")}
                        </h2>
                        <p className="text-[16px] font-Poppins leading-relaxed text-gray-700 dark:text-gray-300">
                            {t("about-section5-content")}
                        </p>
                    </div>

                    <p className="text-[18px] font-Poppins font-semibold leading-relaxed mt-8">
                        {t("about-conclusion")}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default About;

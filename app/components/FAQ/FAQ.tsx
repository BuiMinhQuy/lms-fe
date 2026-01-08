import { styles } from "@/app/styles/style";
import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import React, { useEffect, useState } from "react";
import { HiMinus, HiPlus } from "react-icons/hi";
import { useTranslation } from "react-i18next";

type Props = {};

const FAQ = (props: Props) => {
    const { t } = useTranslation();
    const { data, isLoading } = useGetHeroDataQuery("FAQ", {});
    const [activeQuestion, setActiveQuestion] = useState(null);
    const [questions, setQuestions] = useState<any[]>([]);
    useEffect(() => {
        if (data) {
            setQuestions(data.layout.faq);
        }
    }, [data]);
    //console.log("faq", data);
    const toggleQuestion = (id: any) => {
        setActiveQuestion(activeQuestion === id ? null : id);
    };
    return (
        <div className="w-full min-h-screen bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-black">
            <div className="w-[95%] 800px:w-[92%] m-auto py-2 text-black dark:text-white px-3">
                <h1 className={`${styles.title} !text-start pt-2 800px:text-[40px]`}>{t("faq-title")}</h1>
                <div className="mt-12 pb-8">
                    <dl className="space-y-8">
                        {questions.map((q: any) => (
                            <div
                                className={`${q._id !== questions[0]?._id && "border-t"} border-gray-200 dark:border-gray-700 pt-6`}
                                key={q._id}
                            >
                                <dt className="text-lg">
                                    <button
                                        className="flex items-start justify-between w-full text-left focus:outline-none"
                                        onClick={() => toggleQuestion(q._id)}
                                    >
                                        <span className="font-medium text-black dark:text-white">{q.question}</span>
                                        <span className="ml-6 flex-shrink-0">
                                            {activeQuestion === q._id ? (
                                                <HiMinus className="h-6 w-6 text-black dark:text-white" />
                                            ) : (
                                                <HiPlus className="h-6 w-6 text-black dark:text-white" />
                                            )}
                                        </span>
                                    </button>
                                </dt>
                                {activeQuestion === q._id && (
                                    <dd className="mt-2 pr-12">
                                        <p className="text-base font-Poppins text-black dark:text-white">{q.answer}</p>
                                    </dd>
                                )}
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    );
};

export default FAQ;

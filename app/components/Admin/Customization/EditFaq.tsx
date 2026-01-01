import { styles } from "@/app/styles/style";
import { useGetHeroDataQuery, useUpdateLayoutMutation } from "@/redux/features/layout/layoutApi";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { AiOutlineDelete } from "react-icons/ai";
import { HiMinus, HiPlus } from "react-icons/hi";
import { IoMdAddCircleOutline } from "react-icons/io";

type Props = {};

const EditFaq = (props: Props) => {
    const { t } = useTranslation();
    const { data, isLoading } = useGetHeroDataQuery("FAQ", {
        refetchOnMountOrArgChange: true,
    });

    const [editLayout, { isSuccess: layoutSuccess, error }] = useUpdateLayoutMutation();
    const [questions, setQuestions] = useState<any[]>([]);

    useEffect(() => {
        if (data) {
            setQuestions(data.layout.faq);
        }
        if (layoutSuccess) {
            toast.success(t("faq-updated"));
        }
        if (error) {
            if ("data" in error) {
                const errorData = error as any;
                toast.error(errorData.data.message);
            }
        }
    }, [data, layoutSuccess, error]);
    const toggleQuestion = (id: any) => {
        setQuestions(
            questions.map((question) => (question._id === id ? { ...question, active: !question.active } : question))
        );
    };
    const handleQuestionChange = (id: any, value: string) => {
        setQuestions((pre) =>
            pre.map((question) => (question._id === id ? { ...question, questions: value } : question))
        );
    };

    const handleAnswerChange = (id: any, value: string) => {
        setQuestions((pre) => pre.map((question) => (question._id === id ? { ...question, answer: value } : question)));
    };
    const newFaqHandler = () => {
        setQuestions([...questions, { questions: "", answer: "" }]);
    };
    //function to check if the FAQ arrays are unchanged
    const areQuestionsUnchanged = (originalQuestions: any[], newQuestions: any[]) => {
        return JSON.stringify(originalQuestions) === JSON.stringify(newQuestions);
    };
    const isArrayQuestionEmpty = (questions: any[]) => {
        return questions.some((question) => question.questions === "" || question.answer === "");
    };
    const handleEdit = async () => {
        if (!areQuestionsUnchanged(data.layout.faq, questions) && !isArrayQuestionEmpty(questions)) {
            await editLayout({
                type: "FAQ",
                faq: questions,
            });
        }
    };

    //console.log(questions);
    return (
        <>
            {isLoading ? (
                <div>{t("loading")}</div>
            ) : (
                <div className="w-[90%] 800px:w-[80%] m-auto mt-[120px] h-[100vh]">
                    <div className="mt-12">
                        <dl className="space-y-8">
                            {questions.map((q: any) => (
                                <div
                                    className={`${q._id !== questions[0]?._id && "border-t"} border-gray-200 pt-6`}
                                    key={q._id}
                                >
                                    <dt className="text-lg">
                                        <button
                                            className="flex items-start dark:text-white text-black justify-between w-full text-left focus:outline-none"
                                            onClick={() => toggleQuestion(q._id)}
                                        >
                                            <input
                                                className={`${styles.input} border-none`}
                                                value={q?.question}
                                                onChange={(e) => handleQuestionChange(q._id, e.target.value)}
                                                placeholder={t("add-question")}
                                            />
                                            <span className="ml-6 flex-shrink-0">
                                                {q.active ? (
                                                    <HiMinus className="h-6 w-6" />
                                                ) : (
                                                    <HiPlus className="h-6 w-6" />
                                                )}
                                            </span>
                                        </button>
                                    </dt>
                                    {q.active && (
                                        <dd className="mt-2 pr-12">
                                            <input
                                                className={`${styles.input} border-none`}
                                                value={q.answer}
                                                onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                                                placeholder={t("add-answer")}
                                            />
                                            <span className="ml-6 flex-shrink-0">
                                                <AiOutlineDelete
                                                    className="dark:text-white text-black text-[18px] cursor-pointer"
                                                    onClick={() => {
                                                        setQuestions(
                                                            questions.filter((question) => question._id !== q._id)
                                                        );
                                                    }}
                                                />
                                            </span>
                                        </dd>
                                    )}
                                </div>
                            ))}
                        </dl>
                        <br />
                        <br />
                        <IoMdAddCircleOutline
                            className="dark:text-white text-black text-[25px] cursor-pointer"
                            onClick={newFaqHandler}
                        />
                    </div>
                    <div
                        className={`${
                            styles.button
                        } !w-[100px] !min-h-[40px] !h-[40px] dark:text-white text-black bg-[#cccccc34]
                 
                 ${
                     areQuestionsUnchanged(data.layout.faq, questions) || isArrayQuestionEmpty(questions)
                         ? "!cursor-not-allowed"
                         : "!cursor-pointer !bg-[#42d383]"
                 }
                 !rounded absolute bottom-12 right-12
                 `}
                        onClick={
                            areQuestionsUnchanged(data.layout.faq, questions) || isArrayQuestionEmpty(questions)
                                ? () => null
                                : handleEdit
                        }
                    >
                        {t("save")}
                    </div>
                </div>
            )}
        </>
    );
};

export default EditFaq;

import { styles } from "@/app/styles/style";
import CoursePlayer from "@/app/utils/CoursePlayer";
import Ratings from "@/app/utils/Ratings";
import {
    useAddAnswerInQuestionMutation,
    useAddNewQuestionMutation,
    useAddReplyInReviewMutation,
    useAddReviewInCourseMutation,
    useGetCourseDetailsQuery,
} from "@/redux/features/courses/coursesApi";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiFillStar, AiOutlineArrowLeft, AiOutlineArrowRight, AiOutlineStar } from "react-icons/ai";
import { BiMessage } from "react-icons/bi";
import { VscVerifiedFilled } from "react-icons/vsc";
import { format } from "timeago.js";
import io from "socket.io-client";
const ENDPOINT = "http://localhost:8000";
const socket = io("ws://https://lms-api-qssd.onrender.com", {
    transports: ["websocket"],
});

type Props = {
    data: any;
    id: string;
    activeVideo: number;
    setActivevideo: (activeVideo: number) => void;
    user: any;
    refetch: any;
};

const CourseContentMedia = ({ data, id, activeVideo, setActivevideo, user, refetch }: Props) => {
    const [activeBar, setActiveBar] = useState(0);
    const [comment, setComment] = useState("");
    const [question, setQuestion] = useState("");
    const [questionId, setQuestionId] = useState("");

    const isReviewExist = data?.review?.find((item: any) => item.user._id === user._id);
    const [isReviewReply, setIsReviewReply] = useState(false);

    const [rating, setRating] = useState(0);
    const [answer, setAnswer] = useState("");
    const [reply, setReply] = useState("");
    const [review, setReview] = useState("");
    const [reviewId, setReviewId] = useState("");
    const [addNewQuestion, { isSuccess, error, isLoading: questionCreateLoading }] = useAddNewQuestionMutation();
    const [addAnswerInQuestion, { isSuccess: answerSuccess, error: answerError, isLoading: answerCreationLoading }] =
        useAddAnswerInQuestionMutation();
    const [addReviewInCourse, { isSuccess: reviewSuccess, isLoading: reviewLoading, error: reviewError }] =
        useAddReviewInCourseMutation();
    const { data: courseData, refetch: courseRefetch } = useGetCourseDetailsQuery(id, {
        refetchOnMountOrArgChange: true,
    });
    const [addReplyInReview, { isSuccess: replySuccess, error: replyError, isLoading: replyCreationLoading }] =
        useAddReplyInReviewMutation();
    const course = courseData?.course;

    const handleQuestion = () => {
        if (question.length === 0) {
            toast.error("Question can't be empty");
        } else {
            console.log(question, id, data[activeVideo]._id);
            addNewQuestion({ question, courseId: id, contentId: data[activeVideo]._id });
        }
    };
    const handleAnswwer = (value: string) => {
        setAnswer(value);
        console.log(value);
    };
    useEffect(() => {
        if (isSuccess) {
            setQuestion("");
            refetch();
        }
        if (answerSuccess) {
            setAnswer("");
            refetch();
            toast.success("Answer add successfully");
            if (user.role !== "admin") {
                socket.emit("notification", {
                    title: "New Order",
                    message: `You have a new reply in question ${data[activeVideo].title}`,
                    userId: user._id,
                });
            }
        }
        if (error) {
            if ("data" in error) {
                const errorMessage = error as any;
                toast.error(errorMessage.data.message);
            }
        }
        if (answerError) {
            if ("data" in answerError) {
                const errorMessage = error as any;
                toast.error(errorMessage?.data?.message);
                toast;
            }
        }
        if (reviewSuccess) {
            setReview("");
            setRating(1);
            courseRefetch();
            toast.success("Review added successfully");
            socket.emit("notification", {
                title: "New Order",
                message: `You have a new question in  ${data[activeVideo].title}`,
                userId: user._id,
            });
        }
        if (reviewError) {
            if ("data" in reviewError) {
                const errorMessage = error as any;
                toast.error(errorMessage?.data?.message);
            }
        }
        if (replySuccess) {
            setReply("");
            courseRefetch();
            toast.success("Reply added successfully");
        }
        if (replyError) {
            if ("data" in replyError) {
                const errorMessage = error as any;
                toast.error(errorMessage.data.message);
            }
        }
    }, [isSuccess, error, answerSuccess, answerError, reviewSuccess, reviewError, replyError, replySuccess]);
    const handleAnswerSubmit = () => {
        if (answer?.length == 0) {
            toast.error("Answer can't empty");
            return;
        }
        console.log("1", answer);
        addAnswerInQuestion({ answer: answer, courseId: id, contentId: data[activeVideo]._id, questionId: questionId });
        console.log("object");
    };
    const handleReviewSubmit = async () => {
        if (review.length === 0) {
            toast.error("Review can't be empty");
        } else {
            addReviewInCourse({ review, rating, courseId: id });
        }
    };

    const handleReplyReviewSubmit = async () => {
        if (!replyCreationLoading) {
            if (reply.length === 0) {
                toast.error("Reply field can't be empty");
            } else {
                addReplyInReview({ comment: reply, courseId: id, reviewId });
            }
        }
    };
    console.log("course", course);

    return (
        <div className="w-[95%] 800px:w-[86%] py-4 m-auto">
            <CoursePlayer title={data[activeVideo]?.title} videoUrl={data[activeVideo]?.videoUrl} />

            <div className="w-full flex items-center justify-between my-3">
                <div
                    className={`${styles.button}text-white !w-[unset] !min-h-[40px] !py-[unset] ${activeVideo === 0 && "!cursor-no-drop opacity-[.8]"}`}
                    onClick={() => setActivevideo(activeVideo === 0 ? 0 : activeVideo - 1)}
                >
                    <AiOutlineArrowLeft className="mr-2" />
                    Prev Lesson
                </div>
                <div
                    className={`${styles.button} !w-[unset] w-[80px] text-black dark:text-white !min-h-[40px] !py-[unset] ${data.length - 1 === activeVideo} && '!cursor-no-drop opacity-[.8]'`}
                    onClick={() =>
                        setActivevideo(data && data.length - 1 === activeVideo ? activeVideo : activeVideo + 1)
                    }
                >
                    Next Lesson
                    <AiOutlineArrowRight className="ml-2" />
                </div>
            </div>
            <h1 className="pt-2 text-[25px] font-[600]">{data[activeVideo].title}</h1>
            <br />
            <div className="w-full p-4 flex items-center justify-between bg-slate-500 bg-opacity-20 backdrop-blur shadow-[bg-slate-700] rounded shadow-inner">
                {["Overview", "Resources", "Q&A", "Reviews"].map((text, index) => (
                    <h5
                        key={index}
                        className={`800px:text-[20px] cursor-pointer ${activeBar === index ? "text-red-500" : "text-black dark:text-white"}  `}
                        onClick={() => setActiveBar(index)}
                    >
                        {text}
                    </h5>
                ))}
            </div>
            <br />
            {activeBar === 0 && (
                <p className="text-[18px] whitespace-pre-line mb-3">{data[activeVideo]?.description}</p>
            )}
            {activeBar === 1 && (
                <div>
                    {data[activeVideo]?.links.map((item: any, index: number) => (
                        <div className="mb-5" key={index}>
                            <h2 className="800px:text-[20px] 800px:inline-block dark:text-white text-black">
                                {item.title && item.title + ":"}
                            </h2>
                            <a className="inline-block text-[#4395c4] 800px:text-[20px] 800px:pl-2" href={item.url}>
                                {item.url}
                            </a>
                        </div>
                    ))}
                </div>
            )}
            {activeBar === 2 && (
                <>
                    {" "}
                    <div className="flex w-full">
                        <Image
                            src={user?.avatar ? user.avatar.url : ""}
                            width={50}
                            height={50}
                            alt=""
                            className="rounded-full max-h-[50px] max-w-[50px]"
                        />
                        <textarea
                            name=""
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            id=""
                            rows={4}
                            cols={50}
                            placeholder="Write your question..."
                            className="outline-none bg-transparent ml-3 border border-[#ffffff57] 800px:w-full p-2 rounded w-[90%] 800px:text-[18px] font-Poppins"
                        ></textarea>
                    </div>
                    <div className="w-full flex justify-end">
                        <div
                            className={`${styles.button} !w-[120px] !h-[40px] text-[18px] mt-5
                            ${questionCreateLoading && "cursor-not-allowed"}
                        `}
                            onClick={questionCreateLoading ? () => {} : handleQuestion}
                        >
                            Submit
                        </div>
                    </div>
                    <br />
                    <br />
                    <div className="w-full h-[1px] bg-[#ffffff3b]"></div>
                    <div>
                        <CommentReply
                            data={data}
                            activeVideo={activeVideo}
                            setAnswer={handleAnswwer}
                            handleAnswerSubmit={handleAnswerSubmit}
                            user={user}
                            setQuestionId={setQuestionId}
                        />
                    </div>
                </>
            )}
            {activeBar === 3 && (
                <div className="w-full">
                    {/*Reviews */}
                    <>
                        {!isReviewExist && (
                            <>
                                <div className="flex w-full">
                                    <Image
                                        src={user?.avatar ? user.avatar.url : ""}
                                        width={50}
                                        height={50}
                                        alt=""
                                        className="rounded-full max-h-[50px] max-w-[50px] object-cover"
                                    />
                                    <div className="w-full">
                                        <h5 className="pl-3 text-[20px] font-[500] dark:text-white text-black">
                                            Give a rating <span className="text-red-500">*</span>
                                        </h5>
                                        <div className="flex w-full ml-2 pb-3">
                                            {[1, 2, 3, 4, 5].map((i) =>
                                                rating >= i ? (
                                                    <AiFillStar
                                                        key={i}
                                                        className="mr-1 cursor-pointer"
                                                        color="rgb(246,186,0)"
                                                        size={25}
                                                        onClick={() => setRating(i)}
                                                    />
                                                ) : (
                                                    <AiOutlineStar
                                                        key={i}
                                                        className="mr-1 cursor-pointer"
                                                        size={25}
                                                        color="rgb(246,186,0)"
                                                        onClick={() => setRating(i)}
                                                    />
                                                )
                                            )}
                                        </div>
                                        <textarea
                                            name=""
                                            value={review}
                                            onChange={(e) => setReview(e.target.value)}
                                            id=""
                                            cols={40}
                                            rows={5}
                                            placeholder="Write your comment..."
                                            className="outline-none bg-transparent 800px:ml-3 border border-[#ffffff] w-[95%] 800px:w-full p-2 rounded text-[18px] font-Poppins"
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="w-full flex justify-end">
                                    <div
                                        className={`${styles.button} !w-[120px] !h-[40px] text-[18px] mt-5 ${questionCreateLoading && "cursor-not-allowed"}`}
                                        onClick={handleReviewSubmit}
                                    >
                                        Submit
                                    </div>
                                </div>
                                <br />
                                <br />
                                <div className="w-full h-[1px] bg-[#ffffff3b]"></div>
                                <div className="w-full">
                                    {(course?.reviews && [...course.reviews].reverse())?.map(
                                        (item: any, index: number) => (
                                            <div key={index} className="w-full my-5 dark:text-white text-black">
                                                <div className="w-full flex">
                                                    <div>
                                                        <Image
                                                            src={item?.user?.avatar?.url}
                                                            width={250}
                                                            height={140}
                                                            objectFit="cover"
                                                            className="rounded-full h-[50px] w-[50px] object-cover"
                                                            alt=""
                                                        />
                                                    </div>
                                                    <div className="ml-2">
                                                        <h1 className="text-[18px]">{item?.user.name}</h1>
                                                        <Ratings rating={item.rating} />
                                                        <p>{item.comment}</p>
                                                        <small className="text-[#ffffff83]">
                                                            {format(item.createdAt)}
                                                        </small>
                                                    </div>
                                                </div>
                                                {user.role === "admin" && (
                                                    <span
                                                        className={`${styles.button} !ml-10 cursor-pointer`}
                                                        onClick={() => {
                                                            setIsReviewReply(true);
                                                            setReviewId(item._id);
                                                        }}
                                                    >
                                                        Add Reply
                                                    </span>
                                                )}
                                                {isReviewReply && (
                                                    <div className="flex relative w-full">
                                                        <input
                                                            type="text"
                                                            value={reply}
                                                            onChange={(e: any) => setReply(e.target.value)}
                                                            placeholder="Enter your reply..."
                                                            className="block 800px:ml-12 mt-2 outline-none bg-transparent border-b border-[#000] dark:border-[#fff] p-[5px] w-[95%]"
                                                        />
                                                        <button
                                                            type="submit"
                                                            className="absolute right-0 bottom-1"
                                                            onClick={handleReplyReviewSubmit}
                                                        >
                                                            Submit
                                                        </button>
                                                    </div>
                                                )}
                                                {item.commentReplies.map((i: any, index: number) => (
                                                    <div key={index} className="w-full flex 800px:ml-16 my-5">
                                                        <div className="w-[50px] h-[50px]">
                                                            <div className="w-[50px] h-[50px] bg-slate-600 rounded-[50px] flex items-center justify-center cursor-pointer">
                                                                <h1 className="uppercase text-[18px]">
                                                                    {i.user.name.slice(0, 2)}
                                                                </h1>
                                                            </div>
                                                        </div>
                                                        <div className="pl-2">
                                                            <h5 className="text-[20px]">{i.user.name}</h5>
                                                            <p className="text-white">{i.comment}</p>
                                                            <small className="text-[#ffffff83]">
                                                                {format(i.createdAt)}
                                                            </small>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )
                                    )}
                                </div>
                            </>
                        )}
                    </>
                </div>
            )}
        </div>
    );
};

const CommentReply = ({ data, activeVideo, answer, setAnswer, handleAnswerSubmit, user, setQuestionId }: any) => {
    console.log("data in comment reply", data);
    console.log("activeVideo", activeVideo);
    return (
        <>
            <div className="w-full my-3">
                {data[activeVideo]?.questions?.map((item: any, index: any) => (
                    <CommentItem
                        key={index}
                        data={data}
                        activeVideo={activeVideo}
                        item={item}
                        index={index}
                        answer={answer}
                        setAnswer={setAnswer}
                        setQuestionId={setQuestionId}
                        handleAnswerSubmit={handleAnswerSubmit}
                    />
                ))}
            </div>
        </>
    );
};

const CommentItem = ({ activeVideo, item, answer, setAnswer, handleAnswerSubmit, setQuestionId }: any) => {
    const [replyActive, setReplyActive] = useState(false);

    return (
        <>
            <div className="my-4">
                <div className="flex mb-2">
                    <div>
                        <Image
                            src={item?.user?.avatar ? item?.user.avatar.url : ""}
                            width={50}
                            height={50}
                            alt=""
                            className="rounded-full max-h-[50px] max-w-[50px] object-cover"
                        />
                    </div>

                    <div className="pl-3 dark:text-white text-black">
                        <h5 className="text-[20px]">{item?.user.name}</h5>
                        <p>{item?.question}</p>
                        <small className="text-[#ffffff83]">{item?.createdAt ? format(item?.createdAt) : ""}</small>
                    </div>
                </div>
                <div className="w-full flex">
                    <span
                        className="800px:pl-16 text-[#000000b8] dark:text-[#ffffff83] cursor-pointer mr-2"
                        onClick={() => {
                            setReplyActive(!replyActive);
                            setQuestionId(item._id);
                        }}
                    >
                        {!replyActive
                            ? item?.questionReplies.length !== 0
                                ? "All Replies"
                                : "Add Reply"
                            : "Hide Reply"}
                    </span>
                    <BiMessage size={20} className="dark:text-[#ffffff83 cursor-pointer text-[#000000b8]" />
                    <span className="pl-1 mt-[-4px] cursor-pointer text-[#000000b8] dark:text-[#ffffff83] ">
                        {item?.questionReplies.length}
                    </span>
                </div>
                {replyActive && (
                    <>
                        {item?.questionReplies.map((item: any, index: number) => (
                            <div className="w-full flex 800px:ml-16 my-5 text-black dark:text-white" key={index}>
                                <div>
                                    <Image
                                        src={item?.user.avatar ? item.user.avatar : ""}
                                        width={50}
                                        height={50}
                                        alt=""
                                        className="rounded-full max-h-[50px] max-w-[50px] object-cover"
                                    />
                                </div>
                                <div className="pl-2">
                                    <div className="flex items-center">
                                        <h5 className="text-[20px]">{item?.user.name}</h5>{" "}
                                        {item?.user.role === "Admin" && (
                                            <VscVerifiedFilled className="text-[#50c750] ml-2 text-[20px]" />
                                        )}{" "}
                                    </div>
                                    <p>{item.answer}</p>
                                    <small className="text-[#ffffff83]">{format(item?.createdAt)}</small>
                                </div>
                            </div>
                        ))}
                        <>
                            <div className="w-full flex relative dark:text-white text-black ">
                                <input
                                    type="text"
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    placeholder="Write a reply..."
                                    className="block 800px:ml-2 mt-2 outline-none bg-transparent border-b border-[#00000027] dark:text-white text-black dark:border-[#fff] p-[5px] w-[95%]"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-0 bottom-1"
                                    disabled={answer === ""}
                                    onClick={() => handleAnswerSubmit(answer)}
                                >
                                    Send
                                </button>
                            </div>
                        </>
                    </>
                )}
            </div>
        </>
    );
};
export default CourseContentMedia;

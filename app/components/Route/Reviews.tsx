import { styles } from "@/app/styles/style";
import Image from "next/image";
import React from "react";
import ReviewCard from "../Review/ReviewCard";

type Props = {};

export const reviews = [
    {
        name: "Gene Bates",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        profession: "Student | Cambridge university",
        comment:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quidem, Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quidem",
    },
    {
        name: "Verna Santos",
        avatar: "https://randomuser.me/api/portraits/women/1.jpg",
        profession: "Full stack developer | Quarter ltd.",
        comment: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quidem.",
    },
    {
        name: "Jay Gibbs",
        avatar: "https://randomuser.me/api/portraits/men/2.jpg",
        profession: "computer systems engineering student | Zimbabwe",
        comment:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quidem.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quidem.",
    },
    {
        name: "Mina Davidson",
        avatar: "https://randomuser.me/api/portraits/women/2.jpg",
        profession: "Junior Web Developer | Indonesia",
        comment: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quidem.",
    },
    {
        name: "Rosemary Smith",
        avatar: "https://randomuser.me/api/portraits/women/2.jpg",
        profession: "Junior Web Developer | Indonesia",
        comment:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quidem. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quidem.",
    },
    {
        name: "Laura Mckenize",
        avatar: "https://randomuser.me/api/portraits/women/2.jpg",
        profession: "Junior Web Developer | Indonesia",
        comment: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quidem.",
    },
];

const Reviews = (props: Props) => {
    return (
        <div className="w-[90%] 800px:w-[85%] m-auto">
            <div className="w-full 800px:flex items-center gap-4 ">
                <div className="800px:w-[50%] w-full rounded-md">
                    <Image
                        src={require("../../../public/images/business.png")}
                        alt="business"
                        width={700}
                        height={700}
                        className="rounded-[36px]"
                    />
                </div>

                <div className="800px:w-[50%] w-full">
                    <h3 className={`${styles.title} 800px:!text-[40px]`}>
                        Our Students Are{" "}
                        <span className="bg-gradient-to-l from-indigo-500 via-red-500 to-blue-500 text-transparent bg-clip-text">
                            Our Strength
                        </span>
                        &apos;{" "}
                    </h3>
                    <h3 className={`${styles.title} 800px:!text-[40px]`}>See What They Say About Us</h3>
                    <br />
                    <p className={styles.label}>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
                        the industry`&apos`s standard dummy text ever since the 1500s, when an unknown printer took a
                        galley of type and scrambled it to make a type specimen book. It has survived not only five
                        centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It
                        was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum
                        passages, and more recently with desktop publishing software like Aldus PageMaker including
                        versions of Lorem Ipsum.
                    </p>
                    <br />
                    <br />
                </div>
            </div>
            <br />
            <br />
            <div className="grid grid-cols-1 gap-[25px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-2 ">
                {/* Make sure 'reviews' is properly defined and contains data */}
                {reviews && reviews.length > 0 ? (
                    reviews.map((i, index) => <ReviewCard item={i} key={index} />)
                ) : (
                    <p>No reviews available</p> // Optional: display a fallback message when reviews are not available
                )}
            </div>
        </div>
    );
};

export default Reviews;

"use client";
import React, { FC, useEffect, useState } from "react";
import SideBarProfile from "./SideBarProfile";
import { useLogOutQuery } from "@/redux/features/auth/authApi";
import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import ProfileInfo from "./ProfileInfo";
import ChangePassword from "./ChangePassword";
import { sign } from "crypto";
import toast from "react-hot-toast";
import { useGetUsersAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import CourseCard from "../Course/CourseCard";
type Props = {
    user: any;
};

const Profile: FC<Props> = ({ user }) => {
    const [scroll, setScroll] = useState(false);
    const [avatar, setAvatar] = useState(user?.avatar?.url);
    const [active, setActive] = useState(1);
    const [logout, setLogout] = useState(false);

    const {
        data: logoutData,
        isLoading: logoutIsLoading,
        error: logoutError,
    } = useLogOutQuery(undefined, { skip: !logout });
    const { data, isLoading } = useGetUsersAllCoursesQuery(undefined, {});
    const [courses, setCourses] = useState([]);
    console.log("data", data);
    const logOutHandler = async () => {
        await signOut();
        setLogout(true);
    };

    if (typeof window !== "undefined") {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 85) {
                setScroll(true);
            } else {
                setScroll(false);
            }
        });
    }
    useEffect(() => {
        if (!isLoading && !logoutError && data) {
            // Check for successful logout
            //console.log("Logged out successfully:", data); // Or other success handling
            toast.success("Logged out successfully");
        } else if (!isLoading && logoutError) {
            // Add error handling if necessary
            console.error("Logout error:", logoutError); // Log the error for debugging
        }
    }, [logoutData, logoutIsLoading, logoutError]);
    useEffect(() => {
        if (data) {
            const filteredcourses = user.courses
                .map((userCourse: any) => data.course.find((course: any) => course._id === userCourse._id))
                .filter((course: any) => course !== undefined);

            setCourses(filteredcourses);
        }
    }, [data]);

    return (
        <div className="w-[100%] flex mx-auto h-[100vh] gap-12">
            <div
                className={` w-[60px] 800px:w-[310px] h-[450px]  ${scroll ? "top-[120px]" : "top-[30px]"} 
                dark:bg-slate-900 bg-opacity-90 border bg-white dark:border-[#ffffff1d] border-[#00000014] rounded-xl overflow-hidden shadow-sm mt-[80px] mb-[80px] sticky ${scroll ? "top-120px" : "top-[30px]"} left-[30px]`}
            >
                <SideBarProfile
                    user={user}
                    active={active}
                    avatar={avatar}
                    setActive={setActive}
                    logOutHandler={logOutHandler}
                />
            </div>
            {active === 1 && (
                <div className="w-full h-full bg-transparent mt-20">
                    <ProfileInfo user={user} avatar={avatar} />
                </div>
            )}
            {active === 2 && (
                <div className="w-full h-full bg-transparent mt-20">
                    <ChangePassword />
                </div>
            )}
            {active === 3 && (
                <div className="w-full h-full bg-transparent mt-20">
                    <div className="w-full pl-7 px-2 800px:px-10 800px:pl-8">
                        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-2 lg:gap-[25px] xl:grid-cols-3 xl:gap-[16px]">
                            {courses &&
                                courses.map((item: any, index: number) => (
                                    <CourseCard item={item} key={index} user={user} isProfile={true} />
                                ))}
                        </div>
                        {courses.length === 0 && (
                            <h1 className="text-center text-[18px] font-Poppins">
                                {" "}
                                You dont have any purchased courses!
                            </h1>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;

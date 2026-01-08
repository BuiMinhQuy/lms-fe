"use client";
import { useGetUsersAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Loader from "../components/Loader/Loader";
import Header from "../components/Header";
import CourseCard from "../components/Course/CourseCard";
import { styles } from "../styles/style";
import Heading from "../utils/Heading";

type Props = {};

const Page = (props: Props) => {
    const { t } = useTranslation();
    const searchParams = useSearchParams();
    const search = searchParams?.get("title");
    const { data, isLoading } = useGetUsersAllCoursesQuery(undefined, {});
    const { data: categoriesData } = useGetHeroDataQuery("Categories", {});
    const [route, setRoute] = useState("Login");
    const [open, setOpen] = useState(false);
    const [courses, setCourses] = useState([]);
    const [category, setCategory] = useState("All");
  //  console.log("category", category);
    useEffect(() => {
        if (category === "All") {
            setCourses(data?.course);
        }
        if (category !== "All") {
            setCourses(data.course.filter((item: any) => item.categories === category));
        }
    }, [data, category, search]);
    useEffect(() => {
      //  console.log("search",search);
        if (search) {
          //  console.log('1',data?.course)

          //  console.log('2',data?.course.filter((item: any) => item.name.toLowerCase().includes(search.toLowerCase())))
            setCourses(data?.course.filter((item: any) => item.name.toLowerCase().includes(search.toLowerCase())));
        }
    }, [data]);

    const categories = categoriesData?.layout.categories;

    return (
        <div className="min-h-screen">
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <Header route={route} setRoute={setRoute} open={open} setOpen={setOpen} activeItem={1} />
                    <div className="w-[95%] 800px:w-[85%] m-auto py-4 pb-12">
                        <Heading
                            title={"All courses - Elearning"}
                            description={"Elearning is a programming community"}
                            keywords={"programming community, coding skills, expert insights, collaboration, growth"}
                        />
                        <br />
                        <div className="w-full items-center flex-wrap flex ">
                            <div
                                onClick={() => setCategory("All")}
                                className={`h-[35px] ${category === "All" ? "bg-[crimson]" : "bg-[#5050cb]"}
                            m-3 px-3 rounded-[30px] flex items-center justify-center font-Poppins cursor-pointer
                            `}
                            >
                                {t("all")}
                            </div>
                            {categories &&
                                categories.map((item: any, index: number) => (
                                    <div key={index}>
                                        <div
                                            className={`h-[35px]
                                            ${category === item.title ? "bg-[crimson]" : "bg-[#5050cb]"}
                                            m-3 px-3 rounded-[30px] flex items-center justify-center font-Poppins curosr-pointer
                                            `}
                                            onClick={() => setCategory(item.title)}
                                        >
                                            {item.title}
                                        </div>
                                    </div>
                                ))}
                        </div>
                        {courses && courses.length === 0 && (
                            <p className={`${styles.label} justify-center min-h-[50vh] flex items-center`}>
                                {search
                                    ? t("no-course-found")
                                    : t("no-courses-category")}
                            </p>
                        )}
                        <br />
                        <br />
                        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] 1500px:grid-cols-4 mb-8">
                            {courses &&
                                courses.map((item: any, index: number) => <CourseCard item={item} key={index} user={null} />)}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Page;

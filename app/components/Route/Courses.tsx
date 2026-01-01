import { useGetUsersAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CourseCard from "../Course/CourseCard";

type Props = {};

const Courses = (props: Props) => {
    const { t } = useTranslation();
    const { data, isLoading } = useGetUsersAllCoursesQuery({});
    const [courses, setCourses] = useState<any[]>([]);
    useEffect(() => {
        setCourses(data?.course);
    }, [data]);
    //console.log("data", data);
    //console.log("coursess", courses);

    return (
        <div>
            <div className={`w-[90%] 800px:w-[80%] m-auto`}>
                <h1 className="text-center font-Poppins text-[25px] leading-[35px] sm:text-3xl lg:text-4xl dark:text-white 800px:!leading-[60px] text-[#000] font-[700] tracking-tight">
                    {t("expand-career")}
                    <span className="text-gradient"> {t("opportunity")}</span> <br />
                    {t("opportunity-with-courses")}
                </h1>
                <br />
                <br />
                <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] 1500px:grid-cols-4 1500px:gap-[35px] mb-12 border-0">
                    {courses && courses.map((item: any, index: number) => <CourseCard item={item} key={index} user={null} />)}
                </div>
            </div>
        </div>
    );
};

export default Courses;

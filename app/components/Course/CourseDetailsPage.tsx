"use client";
import { useGetCourseDetailsQuery } from "@/redux/features/courses/coursesApi";
import React, { useState } from "react";
import Loader from "../Loader/Loader";
import Heading from "@/app/utils/Heading";
import CourseDetails from "./CourseDetails";
import Header from "../Header";

type Props = {
    id: string;
};

const CourseDetailsPage = ({ id }: Props) => {
    const [route, setRoute] = useState("Login");
    const [open, setOpen] = useState(false);
    const { data, isLoading } = useGetCourseDetailsQuery(id);

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <div>
                    <Heading
                        title={data?.course?.name + "- ELearning"}
                        description={
                            "Elearning is programming comminity which is developed by NAMNPHfor helping programmers"
                        }
                        keywords={data?.course?.tags}
                    />
                    <Header open={open} route={route} setRoute={setRoute} setOpen={setOpen} activeItem={1} />
                    {data?.course && (
                        <CourseDetails
                            setRoute={setRoute}
                            setOpen={setOpen}
                            data={data.course}
                        />
                    )}
                </div>
            )}
        </>
    );
};

export default CourseDetailsPage;

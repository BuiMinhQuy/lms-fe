import { useGetCourseContentQuery } from "@/redux/features/courses/coursesApi";
import React, { useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import Heading from "@/app/utils/Heading";
import CourseContentMedia from "./CourseContentMedia";
import Header from "../Header";
import CourseContentList from "./CourseContentList";

type Props = {
    id: string;
    user: any;
};

const CourseContent = ({ id, user }: Props) => {
    const { data: contentData, isLoading, refetch } = useGetCourseContentQuery(id);
    const data = contentData?.content ?? [];
    const [open, setOpen] = useState(false);
    const [activeVideo, setActiveVideo] = useState(0);
    const [route, setRoute] = useState("Login");
    
    // Ensure activeVideo is always within bounds when content changes
    useEffect(() => {
        if (activeVideo >= data.length && data.length > 0) {
            setActiveVideo(0);
        }
    }, [data.length]);

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <Header activeItem={1} open={open} setOpen={setOpen} route={route} setRoute={setRoute} />

                    <div className="w-full grid 800px:grid-cols-10">
                        <Heading
                            title={data[activeVideo]?.title || ""}
                            description="anything"
                            keywords={data[activeVideo]?.tags || []}
                        />
                        <div className="col-span-7">
                            <CourseContentMedia
                                data={data}
                                id={id}
                                activeVideo={activeVideo}
                                setActivevideo={setActiveVideo}
                                user={user}
                                refetch={refetch}
                            />
                        </div>
                        <div className=" hidden 800px:block 800px:col-span-3">
                            <CourseContentList data={data} setActiveVideo={setActiveVideo} activeVideo={activeVideo} />
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default CourseContent;

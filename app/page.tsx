"use client";
import React, { FC, use, useState } from "react";
import Heading from "./utils/Heading";
import Header from "./components/Header";
import Hero from "./components/Route/Hero";
import { useSelector } from "react-redux";
import Loader from "./components/Loader/Loader";
import Profile from "./components/Profile/Profile";
import Courses from "./components/Route/Courses";
import Reviews from "./components/Route/Reviews";
import FAQ from "./components/FAQ/FAQ";
import VideoUploader from "./components/Course/UploadVideo";
import VideoUpload from "./components/Course/UploadVideo";

interface Props {}

const Page: FC<Props> = (props) => {
    const [open, setOpen] = useState(true);
    const [activeItem, setActiveItem] = useState(0);
    const [route, setRoute] = useState("");
    const { user } = useSelector((state: any) => state.auth);
    return (
        <div>
            <Heading
                title="ELearning"
                description="ELearning is a platform for students to learn and get help from teachers"
                keywords="Programming, MERN, Redux, Machine Learning"
            />
            {/* <Loader/> */}
            <Header open={open} setOpen={setOpen} activeItem={activeItem} route={route} setRoute={setRoute} />
            <Hero />
            <Courses />
            <Reviews />
            <FAQ />
        </div>
    );
};

export default Page;

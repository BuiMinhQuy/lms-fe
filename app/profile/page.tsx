"use client";
import React, { FC, useState } from "react";

import { useSelector } from "react-redux";
import Heading from "../utils/Heading";
import Protected from "../hooks/useProtected";
import Header from "../components/Header";
import Profile from "../components/Profile/Profile";
interface Props {}

const Page: FC<Props> = (props) => {
    const [open, setOpen] = useState(true);
    const [activeItem, setActiveItem] = useState(0);
    const [route, setRoute] = useState("");
    const { user } = useSelector((state: any) => state.auth);
    //   console.log('user',user);
    return (
        <div>
            <Protected>
                <Heading
                    title="ELearning"
                    description="ELearning is a platform for students to learn and get help from teachers"
                    keywords="Programming, MERN, Redux, Machine Learning"
                />
                <Header open={open} setOpen={setOpen} activeItem={activeItem} route={route} setRoute={setRoute} />
                <Profile user={user} />
            </Protected>
        </div>
    );
};

export default Page;

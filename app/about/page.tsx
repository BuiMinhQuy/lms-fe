"use client";
import React, { useState } from "react";
import Header from "../components/Header";
import Heading from "../utils/Heading";
import About from "./about";

type Props = {};

const Page = (props: Props) => {
    const [route, setRoute] = useState("Login");
    const [open, setOpen] = useState(false);
    const [activeItem, setActiveItem] = useState(2);
    return (
        <div className="min-h-screen">
            <Heading
                title={"About - Elearning"}
                description={"Elearning is a learning management system for helpling programmers"}
                keywords={"programming community, coding skills, expert insights, collaboration, growth"}
            />
            <Header open={open} setOpen={setOpen} activeItem={activeItem} setRoute={setRoute} route={route} />

            <About />
        </div>
    );
};

export default Page;


"use client";
import React, { useState } from "react";
import Header from "../components/Header";
import Heading from "../utils/Heading";
import FAQ from "../components/FAQ/FAQ";

type Props = {};

const Page = (props: Props) => {
    const [route, setRoute] = useState("Login");
    const [open, setOpen] = useState(false);
    const [activeItem, setActiveItem] = useState(4);
    return (
        <div className="min-h-screen">
            <Heading
                title={"FAQ - Elearning"}
                description={"Elearning is a learning management system for helpling programmers"}
                keywords={"programming community, coding skills, expert insights, collaboration, growth"}
            />
            <Header open={open} setOpen={setOpen} activeItem={activeItem} setRoute={setRoute} route={route} />

            <div className="w-full pb-12">
                <FAQ />
            </div>
        </div>
    );
};

export default Page;


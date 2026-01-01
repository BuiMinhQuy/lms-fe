"use client";
import React, { useState } from "react";
import AdminProtected from "@/app/hooks/adminProtected";
import Heading from "@/app/utils/Heading";
import AdminSidebar from "@/app/components/Admin/sidebar/AdminSidebar";
import DashboardHeader from "@/app/components/Admin/DashboardHeader";
import CreateCourse from "@/app/components/Admin/Course/CreateCourse";
import EditCourse from "@/app/components/Admin/Course/EditCourse";

const Page: React.FC = ({ params }: any) => {
    // State để quản lý trạng thái Sidebar
    const [collapsed, setCollapsed] = useState(false);
    const id = params.id;
    //console.log(id);
    return (
        <div>
            <AdminProtected>
                <Heading
                    title="ELearning"
                    description="ELearning is a platform for students to learn and get help from teachers"
                    keywords="Programming, MERN, Redux, Machine Learning"
                />
                <div className="flex ">
                    {/* Sidebar */}
                    <div
                        style={{
                            width: collapsed ? "80px" : "270px",
                            transition: "width 0.3s ease",
                        }}
                    >
                        <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
                    </div>
                    {/* Right Section */}
                    <div
                        style={{
                            flex: 1, // Chiếm toàn bộ không gian còn lại
                            transition: "margin-left 0.3s ease",
                        }}
                        className="bg-black-100"
                    >
                        <DashboardHeader />
                        <EditCourse id={id} />
                    </div>
                </div>
            </AdminProtected>
        </div>
    );
};

export default Page;

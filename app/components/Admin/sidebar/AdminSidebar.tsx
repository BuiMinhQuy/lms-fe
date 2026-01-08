import React, { useEffect, useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { IconButton, Typography, Box } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import GroupsIcon from "@mui/icons-material/Groups";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CategoryIcon from "@mui/icons-material/Category";
import SettingsIcon from "@mui/icons-material/Settings";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Image from "next/image";
// import avatarDefault from "../../../../public/images/avatar.png"; // Commented out due to corrupted file
import "./customSidebar.css";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
const AdminSidebar: React.FC<{ collapsed: boolean; setCollapsed: React.Dispatch<React.SetStateAction<boolean>> }> = ({
    collapsed,
    setCollapsed,
}) => {
    const { t } = useTranslation();
    const [selected, setSelected] = useState<string>("Dashboard");
    const { theme } = useTheme();
    const router = useRouter();
    const { user } = useSelector((state: any) => state.auth);

    const handleToggle = () => {
        setCollapsed(!collapsed);
    };

    const navigateDashboard = () => {
        router.push("/admin");
        setSelected("Dashboard");
    };

    const navigateUsers = () => {
        router.push("/admin/users");
        setSelected("Users");
    };

    const navigateCreateCourse = () => {
        router.push("/admin/create-course");
        setSelected("Create Course");
    };

    const navigateAllCourse = () => {
        router.push("/admin/courses");
        setSelected("Live Courses");
    };

    const navigateHero = () => {
        router.push("/admin/hero");
        setSelected("Hero");
    };

    const navigateFAQ = () => {
        router.push("/admin/faq");
        setSelected("FAQ");
    };

    const navigateCategories = () => {
        router.push("/admin/categories");
        setSelected("Categories");
    };

    const navigateTeam = () => {
        router.push("/admin/team");
        setSelected("Manage Team");
    };

    const navigateCourseAnalytics = () => {
        router.push("/admin/course-analytics");
        setSelected("Courses Analytics");
    };

    const navigateOrdersAnalytics = () => {
        router.push("/admin/orders-analytics");
        setSelected("Orders Analytics");
    };

    const navigateUsersAnalytics = () => {
        router.push("/admin/user-analytics");
        setSelected("Users Analytics");
    };

    const getMenuItemStyle = (item: string) => ({
        backgroundColor: selected === item ? "#3b82f6" : "transparent",
        color: selected === item ? "#FFF" : "#A0AEC0",
    });

    useEffect(() => {
        // Dynamically add theme class to the body
        document.body.classList.remove("light-theme", "dark-theme");
        document.body.classList.add(theme === "dark" ? "dark-theme" : "light-theme");
    }, [theme]);

    return (
        <Box
            sx={{
                position: "fixed",
                top: 0,
                left: 0,
                height: "100vh",
                display: "flex",
                color: "#FFF",
                transition: "all 1s ease", // Transition duration set to 1s (1000ms)
            }}
        >
            <ProSidebar
                collapsed={collapsed}
                style={{
                    height: "100vh",
                    overflow: "hidden",
                    transition: "all 1s ease", // Transition duration set to 1s (1000ms)
                }}
            >
                {/* Sidebar Header */}
                <Box
                    sx={{
                        padding: "10px",
                        textAlign: "center",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    {!collapsed && (
                        <Typography variant="h6" sx={{ color: "#FFF" }}>
                            ELEARNING
                        </Typography>
                    )}
                    <div
                        className=" flex items-center justify-center w-12 h-12 cursor-pointer hover:text-[#a0aec0]"
                        onClick={handleToggle}
                    >
                        {collapsed ? (
                            <ArrowForwardIosIcon sx={{ fontSize: "24px" }} />
                        ) : (
                            <ArrowBackIosIcon sx={{ fontSize: "24px" }} />
                        )}
                    </div>
                </Box>

                {/* Avatar Section */}
                {!collapsed && (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "column",
                            marginBottom: "10px",
                        }}
                    >
                        <Image
                                                            src={user?.avatar ? user?.avatar?.url : "/images/business.png"}
                            alt="avatar"
                            width={50}
                            height={50}
                            style={{ borderRadius: "50%" }}
                        />
                        <Typography variant="body1" sx={{ color: "#FFF", marginTop: "5px" }}>
                            {user?.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#A0AEC0" }}>
                            {user?.role}
                        </Typography>
                    </Box>
                )}

                {/* Menu */}
                <Menu iconShape="circle">
                    <MenuItem
                        icon={<HomeOutlinedIcon />}
                        onClick={navigateDashboard}
                        style={getMenuItemStyle("Dashboard")}
                    >
                        {!collapsed && t("dashboard")}
                    </MenuItem>

                    {/* Data Section */}
                    {!collapsed && (
                        <Typography variant="body2" sx={{ color: "#A0AEC0", margin: "10px 20px" }}>
                            {t("data")}
                        </Typography>
                    )}
                    <MenuItem
                        icon={<GroupsIcon />}
                        onClick={navigateUsers}
                        style={getMenuItemStyle("Users")}
                    >
                        {!collapsed && t("users")}
                    </MenuItem>

                    {/* Content Section */}
                    {!collapsed && (
                        <Typography variant="body2" sx={{ color: "#A0AEC0", margin: "10px 20px" }}>
                            {t("content")}
                        </Typography>
                    )}
                    <MenuItem onClick={navigateCreateCourse} icon={<VideoLibraryIcon />} style={getMenuItemStyle("Create Course")}>
                        {!collapsed && t("create-course")}
                    </MenuItem>
                    <MenuItem icon={<VideoLibraryIcon />} onClick={navigateAllCourse} style={getMenuItemStyle("Live Courses")}>
                        {!collapsed && t("live-courses")}
                    </MenuItem>

                    {/* Customization Section */}
                    {!collapsed && (
                        <Typography variant="body2" sx={{ color: "#A0AEC0", margin: "10px 20px" }}>
                            {t("customization")}
                        </Typography>
                    )}
                    <MenuItem 
                        icon={<CategoryIcon />} 
                        onClick={navigateHero}
                        style={getMenuItemStyle("Hero")}
                    >
                        {!collapsed && t("hero")}
                    </MenuItem>
                    <MenuItem 
                        icon={<HelpOutlineIcon />} 
                        onClick={navigateFAQ}
                        style={getMenuItemStyle("FAQ")}
                    >
                        {!collapsed && t("faq")}
                    </MenuItem>
                    <MenuItem 
                        icon={<CategoryIcon />} 
                        onClick={navigateCategories}
                        style={getMenuItemStyle("Categories")}
                    >
                        {!collapsed && t("categories")}
                    </MenuItem>

                    {/* Controllers */}
                    {!collapsed && (
                        <Typography variant="body2" sx={{ color: "#A0AEC0", margin: "10px 20px" }}>
                            {t("controllers")}
                        </Typography>
                    )}
                    <MenuItem icon={<SettingsIcon />} onClick={navigateTeam} style={getMenuItemStyle("Manage Team")}>
                        {!collapsed && t("manage-team")}
                    </MenuItem>

                    {/* Analytics */}
                    {!collapsed && (
                        <Typography variant="body2" sx={{ color: "#A0AEC0", margin: "10px 20px" }}>
                            {t("analytics")}
                        </Typography>
                    )}
                    <MenuItem icon={<SettingsIcon />} onClick={navigateCourseAnalytics} style={getMenuItemStyle("Courses Analytics")}>
                        {!collapsed && t("courses-analytics")}
                    </MenuItem>
                    <MenuItem icon={<SettingsIcon />} onClick={navigateOrdersAnalytics} style={getMenuItemStyle("Orders Analytics")}>
                        {!collapsed && t("orders-analytics")}
                    </MenuItem>
                    <MenuItem icon={<SettingsIcon />} onClick={navigateUsersAnalytics} style={getMenuItemStyle("Users Analytics")}>
                        {!collapsed && t("users-analytics")}
                    </MenuItem>
                </Menu>
            </ProSidebar>
        </Box>
    );
};

export default AdminSidebar;

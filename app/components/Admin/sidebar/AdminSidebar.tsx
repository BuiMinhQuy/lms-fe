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
const AdminSidebar: React.FC<{ collapsed: boolean; setCollapsed: React.Dispatch<React.SetStateAction<boolean>> }> = ({
    collapsed,
    setCollapsed,
}) => {
    const [selected, setSelected] = useState<string>("Dashboard");
    const { theme } = useTheme();
    const router = useRouter();
    const { user } = useSelector((state: any) => state.auth);

    const handleToggle = () => {
        setCollapsed(!collapsed);
    };
    const handleMenuItemClick = (item: string) => {
        router.push("/admin/users");
        setSelected(item);
    };

    const getMenuItemStyle = (item: string) => ({
        backgroundColor: selected === item ? "#3b82f6" : "transparent",
        color: selected === item ? "#FFF" : "#A0AEC0",
    });

    const handleCreateCourse = () => {
        router.push("/admin/create-course");
    };

    useEffect(() => {
        // Dynamically add theme class to the body
        document.body.classList.remove("light-theme", "dark-theme");
        document.body.classList.add(theme === "dark" ? "dark-theme" : "light-theme");
    }, [theme]);
    const navigateAllCourse = () => {
        router.push("/admin/courses");
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
                        onClick={() => handleMenuItemClick("Dashboard")}
                        style={getMenuItemStyle("Dashboard")}
                    >
                        {!collapsed && "Dashboard"}
                    </MenuItem>

                    {/* Data Section */}
                    {!collapsed && (
                        <Typography variant="body2" sx={{ color: "#A0AEC0", margin: "10px 20px" }}>
                            Data
                        </Typography>
                    )}
                    <MenuItem
                        icon={<GroupsIcon />}
                        onClick={() => handleMenuItemClick("Users")}
                        style={getMenuItemStyle("Users")}
                    >
                        Users
                    </MenuItem>
                    <MenuItem
                        icon={<ReceiptOutlinedIcon />}
                        onClick={() => handleMenuItemClick("Invoices")}
                        style={getMenuItemStyle("Invoices")}
                    >
                        Invoices
                    </MenuItem>

                    {/* Content Section */}
                    {!collapsed && (
                        <Typography variant="body2" sx={{ color: "#A0AEC0", margin: "10px 20px" }}>
                            Content
                        </Typography>
                    )}
                    <MenuItem onClick={handleCreateCourse} icon={<VideoLibraryIcon />}>
                        Create Course
                    </MenuItem>
                    <MenuItem icon={<VideoLibraryIcon />} onClick={navigateAllCourse}>
                        Live Courses
                    </MenuItem>

                    {/* Customization Section */}
                    {!collapsed && (
                        <Typography variant="body2" sx={{ color: "#A0AEC0", margin: "10px 20px" }}>
                            Customization
                        </Typography>
                    )}
                    <MenuItem 
                        icon={<CategoryIcon />} 
                        onClick={navigateHero}
                        style={getMenuItemStyle("Hero")}
                    >
                        Hero
                    </MenuItem>
                    <MenuItem 
                        icon={<HelpOutlineIcon />} 
                        onClick={navigateFAQ}
                        style={getMenuItemStyle("FAQ")}
                    >
                        FAQ
                    </MenuItem>
                    <MenuItem 
                        icon={<CategoryIcon />} 
                        onClick={navigateCategories}
                        style={getMenuItemStyle("Categories")}
                    >
                        Categories
                    </MenuItem>

                    {/* Settings */}
                    {!collapsed && (
                        <Typography variant="body2" sx={{ color: "#A0AEC0", margin: "10px 20px" }}>
                            Controllers
                        </Typography>
                    )}
                    <MenuItem icon={<SettingsIcon />}>Manage Team</MenuItem>

                    {/* Analytic */}
                    {!collapsed && (
                        <Typography variant="body2" sx={{ color: "#A0AEC0", margin: "10px 20px" }}>
                            Analytics
                        </Typography>
                    )}
                    <MenuItem icon={<SettingsIcon />}>Courses Analytics</MenuItem>
                    <MenuItem icon={<SettingsIcon />}>Orders Analytics</MenuItem>
                    <MenuItem icon={<SettingsIcon />}>Users Analytics</MenuItem>
                    {/* Analytic */}
                    {!collapsed && (
                        <Typography variant="body2" sx={{ color: "#A0AEC0", margin: "10px 20px" }}>
                            Extras
                        </Typography>
                    )}
                    <MenuItem icon={<SettingsIcon />}>Settings</MenuItem>
                    <MenuItem icon={<SettingsIcon />}>Logout</MenuItem>
                </Menu>
            </ProSidebar>
        </Box>
    );
};

export default AdminSidebar;

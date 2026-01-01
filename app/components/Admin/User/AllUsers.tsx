import React, { FC, useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import { AiOutlineDelete, AiOutlineMail } from "react-icons/ai";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import { useGetAllUserQuery } from "@/redux/features/user/userApi";
import { format } from "timeago.js";
import { styles } from "@/app/styles/style";

type Props = {
    isTeam: boolean;
};

const AllUsers: FC<Props> = ({ isTeam }) => {
    const { t } = useTranslation();
    const { theme, setTheme } = useTheme();
    const { isLoading, data, error } = useGetAllUserQuery({});
    const [active, setActive] = useState(false);
    const [emnail, setEmail] = useState("");
    const [role, setRole] = useState("admin");
    const [open, setOpen] = useState(false);
    const [userId, setUserId] = useState("");
    // const [updateUserRole,{error:updateError,isSuccess}] = useUpdateUserRoleMutation();
    // const [deleteUser, {isSuccess:deleteSuccess, error:deleteError}] = useDeleteUserMutation();

    const columns = [
        { field: "id", headerName: t("id"), flex: 0.3 },
        { field: "name", headerName: t("user-name"), flex: 0.5 },
        { field: "email", headerName: t("email"), flex: 0.5 },
        { field: "role", headerName: t("role"), flex: 0.5 },
        { field: "courses", headerName: t("purchased-courses"), flex: 0.5 },
        { field: "created_at", headerName: t("joined-at"), flex: 0.5 },
        {
            field: " ",
            headerName: t("delete"),
            flex: 0.2,
            renderCell: (params: any) => {
                return (
                    <>
                        <Button>
                            <AiOutlineDelete className="dark:text-white text-black" size={20} />
                        </Button>
                    </>
                );
            },
        },
        {
            field: "sendEmail",
            headerName: t("send-email"),
            flex: 0.2,
            renderCell: (params: any) => {
                return (
                    <>
                        <a href={`mailto:${params.row.email}`}>
                            <AiOutlineMail className="dark:text-white text-black" size={20} />
                        </a>
                    </>
                );
            },
        },
    ];

    const rows: any = [];

    if (isTeam) {
        const newData = data && data.users.filter((item: any) => item.role === "Admin");
        {
            newData &&
                newData.forEach((item: any) => {
                    rows.push({
                        id: item._id,
                        name: item.name,
                        email: item.email,
                        role: item.role,
                        courses: item.courses.length,
                        created_at: format(item.createdAt),
                    });
                });
        }
    } else {
        {
            data &&
                data.users.forEach((item: any) => {
                    rows.push({
                        id: item._id,
                        name: item.name,
                        email: item.email,
                        role: item.role,
                        courses: item.courses.length,
                        created_at: format(item.createdAt),
                    });
                });
        }
    }

    return (
        <div className="mt-[120px]">
            <Box m="20px">
                <div className="w-full flex justify-end">
                    <div
                        className={`${styles.button} !w-[200px] dark:bg-[#57c7a3] h-[35px] dark:border dark:border-[#ffffff6c]`}
                        onClick={() => setActive(!active)}
                    >
                        {t("add-new-member")}
                    </div>
                </div>
                <Box
                    m="40px 0 0 0"
                    height="80vh"
                    sx={{
                        "& .MuiDataGrid-root": {
                            border: "none",
                            outline: "none",
                            backgroundColor: theme === "dark" ? "#3e4396" : "#A4A9FC",
                        },
                        "& .css-pqjvzv-MuiSvgIcon-root-MuiSelect-icon": {
                            color: theme === "dark" ? "#fff" : "#000",
                        },
                        "& .MuiDataGrid-sortIcon": {
                            color: theme === "dark" ? "#fff" : "#000",
                        },
                        "& .MuiDataGrid-row": {
                            color: theme === "dark" ? "#fff" : "#000",
                            borderBottom:
                                theme === "dark" ? "1px solid #ffffff30!important" : "1px solid #ccc!important",
                        },
                        "& .MuiTablePagination-root": {
                            color: theme === "dark" ? "#fff" : "#000",
                        },
                        "& .MuiDataGrid-cell": {
                            borderBottom: "none",
                        },
                        "& .name-column--cell": {
                            color: theme === "dark" ? "#fff" : "#000",
                        },
                        "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: theme === "dark" ? "#3e4396" : "#A4A9FC",
                            borderBottom: "none",
                            color: theme === "dark" ? "#fff" : "#000",
                        },
                        "& .MuiDataGrid-virtualScroller": {
                            backgroundColor: theme === "dark" ? "#1F2A40" : "#F2F0F0",
                        },
                        "& .MuiDataGrid-footerContainer": {
                            color: theme === "dark" ? "#fff" : "#000",
                            borderTop: "none",
                            backgroundColor: theme === "dark" ? "#3e4396" : "#A4A9FC",
                        },
                        "& .MuiCheckbox-root": {
                            color: theme === "dark" ? `#b7ebde !important` : `#000 !important`,
                        },
                        "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                            color: `#fff !important`,
                        },
                        "&. MuiDataGrid-container--top": {
                            backgroundColor: theme === "dark" ? "#3e4396" : "#A4A9FC",
                        },

                        "& .MuiDataGrid-row--borderBottom": {
                            background: "none !important",
                        },
                    }}
                >
                    <DataGrid checkboxSelection rows={rows} columns={columns} />
                </Box>
            </Box>
        </div>
    );
};

export default AllUsers;

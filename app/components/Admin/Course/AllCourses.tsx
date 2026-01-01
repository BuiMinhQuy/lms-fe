import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Modal } from "@mui/material";
import { AiOutlineDelete } from "react-icons/ai";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import { useDeleteCourseMutation, useGetAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import { format } from "timeago.js";
import { styles } from "@/app/styles/style";
import toast from "react-hot-toast";
import Link from "next/link";
import { FiEdit2 } from "react-icons/fi";
type Props = {};

const AllCourses = (props: Props) => {
    const { t } = useTranslation();
    const { theme, setTheme } = useTheme();
    const { isLoading, data, refetch } = useGetAllCoursesQuery({}, { refetchOnMountOrArgChange: true });
    const [courseId, setCourseId] = useState("");
    const [open, setOpen] = useState(false);
    const [deleteCourse, { isSuccess, error }] = useDeleteCourseMutation();
    const columns = [
        { field: "id", headerName: t("id"), flex: 0.5 },
        { field: "title", headerName: t("course-title"), flex: 1 },
        { field: "ratings", headerName: t("ratings"), flex: 0.5 },
        { field: "purchased", headerName: t("purchased"), flex: 0.5 },
        { field: "created_at", headerName: t("created-at"), flex: 0.5 },
        {
            field: " ",
            headerName: t("edit"),
            flex: 0.2,
            renderCell: (params: any) => {
                return (
                    <>
                        <Link href={`/admin/edit-course/${params.row.id}`}>
                            <FiEdit2 className="dark:text-white text-black " size={20} />
                        </Link>
                    </>
                );
            },
        },
        {
            field: "Delete",
            headerName: t("delete"),
            flex: 0.2,
            renderCell: (params: any) => {
                return (
                    <>
                        <Button
                            onClick={() => {
                                //console.log(params.row.id);
                                setCourseId(params.row.id);
                                setOpen(!open);
                            }}
                        >
                            <AiOutlineDelete className="dark:text-white text-black" size={20} />
                        </Button>
                    </>
                );
            },
        },
    ];

    const rows: any = [];
    {
        data &&
            data.courses.forEach((item: any, index: number) => {
                rows.push({
                    id: item._id || index, // Ensure each row has a unique id
                    title: item.name,
                    ratings: item.ratings,
                    purchased: item.purchased,
                    created_at: format(item.createdAt),
                });
            });
    }
    const handleDelete = async () => {
        await deleteCourse(courseId);
    };
    useEffect(() => {
        if (isSuccess) {
            setOpen(false);
            refetch();
            toast.success(t("course-deleted"));
        }
        if (error) {
            if ("data" in error) {
                const errorMessage = error as any;
                toast.error(errorMessage.data.message);
            }
        }
    }, [isSuccess, error]);
    return (
        <div className="mt-[120px]">
            <Box m="20px">
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
                {open && (
                    <Modal
                        open={open}
                        onClose={() => setOpen(!open)}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 bg-white p-5 rounded-md">
                            <h1 className={`${styles.title}`}>{t("delete-course-confirm")}</h1>
                            <div className="flex w-full items-center justify-between mt-5 ">
                                <div
                                    className={`${styles.button} !w-[120px] h-30px focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800`}
                                    onClick={() => setOpen(!open)}
                                >
                                    {t("cancel")}
                                </div>
                                <div
                                    className={`${styles.button} !w-[120px] h-30px bg-[#f00] focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900`}
                                    onClick={handleDelete}
                                >
                                    {t("delete")}
                                </div>
                            </div>
                        </Box>
                    </Modal>
                )}
            </Box>
        </div>
    );
};

export default AllCourses;

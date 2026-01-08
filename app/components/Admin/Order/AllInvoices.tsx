import { useGetAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import { useGetAllUserQuery } from "@/redux/features/user/userApi";
import { Box, Toolbar } from "@mui/material";
import { useTheme } from "next-themes";
import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AiOutlineMail } from "react-icons/ai";
import Loader from "../../Loader/Loader";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { format } from "timeago.js";
import { useGetAllOrdersQuery } from "@/redux/features/orders/ordersApi";
import { formatVND } from "@/app/utils/formatCurrency";
type Props = {
    isDashboard?: boolean;
};

const AllInvoices: FC<Props> = ({ isDashboard }) => {
    const { t } = useTranslation();
    const { theme, setTheme } = useTheme();
    const { isLoading, data } = useGetAllOrdersQuery({});
    const { data: usersData } = useGetAllUserQuery({});
    const { data: coursesData } = useGetAllCoursesQuery({});

    const [orderData, setOrderData] = useState<any>([]);
    //console.log("data", data);
    useEffect(() => {
        if (data) {
            const temp = data.map((item: any) => {
                const user = usersData?.users.find((user: any) => user._id === item.userId);
                const course = coursesData.courses.find((course: any) => course._id === item.courseId);
                return {
                    ...item,
                    userName: user?.name,
                    userEmail: user?.email,
                    title: course?.name,
                    price: formatVND(course?.price),
                };
            });
            setOrderData(temp);
        }
    }, [data, usersData, coursesData]);

    const columns: any = [
        { field: "id", headerName: t("id"), flex: 0.3 },
        { field: "userName", headerName: t("name"), flex: isDashboard ? 0.6 : 0.5 },
        ...(isDashboard
            ? []
            : [
                  { field: "userEmail", headerName: t("email"), flex: 1 },
                  { field: "title", headerName: t("course-title"), flex: 1 },
              ]),
        { field: "price", headerName: t("price"), flex: 0.5 },
        ...(isDashboard
            ? [{ field: "created_at", headerName: t("created-at"), flex: 0.5 }]
            : [
                  {
                      field: " ",
                      headerName: t("email"),
                      flex: 0.2,
                      renderCell: (params: any) => {
                          return (
                              <a href={`mailto:${params.row.userEmail}`}>
                                  <AiOutlineMail className="dark:text-white text-black" size={20} />
                              </a>
                          );
                      },
                  },
              ]),
    ];
    const rows: any = [
        // mock data for testing
        {
            id: "1234556777655",
            userName: "Shahriar Sajeeb",
            userEmail: "programmershahriarsajeeb@gmail.com",
            title: "React JS Course",
            price: formatVND(500),
            created_at: "2 days ago",
        },
        {
            id: "1234556777655",
            userName: "Shahriar Sajeeb",
            userEmail: "programmershahriarsajeeb@gmail.com",
            title: "React JS Course",
            price: formatVND(500),
            created_at: "2 days ago",
        },
        {
            id: "1234556777655",
            userName: "Shahriar Sajeeb",
            userEmail: "programmershahriarsajeeb@gmail.com",
            title: "React JS Course",
            price: formatVND(500),
            created_at: "2 days ago",
        },
    ];
    orderData &&
        orderData.forEach((item: any) => {
            rows.push({
                id: item._id,
                userName: item.userName,
                userEmail: item.userEmail,
                title: item.title,
                price: item.price,
                created_at: format(item.created_at),
            });
        });

    return (
        <div className={!isDashboard ? "mt-[120px]" : "mt-[0px]"}>
            {isLoading ? (
                <Loader />
            ) : (
                <Box m={isDashboard ? "0" : "40px"}>
                    <Box
                        m={isDashboard ? "0" : "40px 0 0 0"}
                        height={isDashboard ? "35vh" : "90vh"}
                        overflow={"hidden"}
                        sx={{
                            "& .MuiDataGrid-root": {
                                border: "none",
                                outline: "none",
                            },
                            "& .css-pqjvzy-MuiSvgIcon-root-MuiSelect-icon": {
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
                                borderBottom: "none!important",
                            },
                            "& .name-column--cell": {
                                color: theme === "dark" ? "#fff" : "#000",
                            },
                            "& .MuiDataGrid-headerContainer": {
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
                                color: theme === "dark" ? "#b7ebde !important" : "#000 !important",
                            },
                            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                                color: "#fff !important",
                            },
                        }}
                    >
                        <DataGrid
                            checkboxSelection={isDashboard ? false : true}
                            rows={rows}
                            columns={columns}
                            // components={isDashboard ? {} : { Toolbar: GridToolbar }}
                        />
                    </Box>
                </Box>
            )}
        </div>
    );
};

export default AllInvoices;

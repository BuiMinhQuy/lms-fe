import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import UsersAnalytics from "../Analytics/UsersAnalytics";
import { Box, CircularProgress } from "@mui/material";
import { PiUsersFourLight } from "react-icons/pi";
import { BiBorderLeft } from "react-icons/bi";
import OrderAnalytics from "../Analytics/OrderAnalytics";
import AllInvoices from "../Order/AllInvoices";
import { useGetOrdersAnalyticsQuery, useGetUsersAnalyticsQuery } from "@/redux/features/analytics/analyticsApi";

type Props = {
    open?: boolean;
    value?: number;
};
const CircularProgressWithLabel: FC<Props> = ({ open, value }) => {
    return (
        <Box sx={{ position: "relative", dispaly: "inline-flex" }}>
            <CircularProgress
                variant="determinate"
                value={value}
                size={45}
                color={value && value > 99 ? "info" : "error"}
                thickness={4}
                style={{ zIndex:-1 }}
            />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: "absolute",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            ></Box>
        </Box>
    );
};


const DashboardWidgets: FC<Props> = ({ open }) => {
    const { t } = useTranslation();
    const [comparePercentenge,setComparePercentenge] = useState();
    const [ordersComparePercentage,setOrdersComparePercentage] = useState();
    const [userComparePercentage,setUserPercentage] = useState();
    const {data,isLoading}= useGetUsersAnalyticsQuery({});
    const { data: ordersData, isLoading: ordersLoading } = useGetOrdersAnalyticsQuery({});

    useEffect(()=>{
        if(isLoading && ordersLoading){
            return;
        }else{
            if(data && ordersData){
                const usersLastTwoMonths = data.users.last12Months.slice(-2);
                const ordersLastTwoMonths = ordersData.orders.last12Months.slice(-2);

                if(usersLastTwoMonths.length === 2 && ordersLastTwoMonths.length === 2) {
                    // Calculate comparison percentages here
                }
            }
        }
    }, [data, ordersData, isLoading, ordersLoading])

    return (
        <div className="mt-[30px] min-h-screen">
            <div className="grid grid-cols-[75%,25%]">
                <div className="p-8">
                    <UsersAnalytics isDashboard={true} />
                </div>
                <div className="pt-[80px] pr-8">
                    <div className="w-full dark:bg-[#111c43] rounded-sm shadow">
                        <div className="flex items-center p-5 justify-between">
                            <div className="">
                                <BiBorderLeft className="dark:text-[#45cba0] text-[#000] text-[30px]" />
                                <h5 className="pt-2 font-Poppins dark:text-[#fff] text-black text-[20px]">120</h5>
                                <h5 className="pt-2 font-Poppins dark:text-[#fff] text-black text-[20px] font-[400]">
                                    {t("sales-obtained")}
                                </h5>
                            </div>
                            <div className="z-[-1]">
                                <CircularProgressWithLabel value={100} open={open} />
                                <h5 className="text-center pt-4">+120%</h5>
                            </div>
                        </div>
                    </div>

                    <div className="w-full dark:bg-[#111c43] rounded-sm shadow my-8">
                        <div className="flex items-center p-5 justify-between">
                            <div className="">
                                <PiUsersFourLight className="dark:text-[#45cba0] text-[#000] text-[30px]" />
                                <h5 className="pt-2 font-Poppins dark:text-[#fff] text-black text-[20px]">450</h5>
                                <h5 className="pt-2 font-Poppins dark:text-[#fff] text-black text-[20px] font-[400]">
                                    {t("new-users")}
                                </h5>
                            </div>
                            <div className="z-[-1]">
                                <CircularProgressWithLabel value={100} open={open} />
                                <h5 className="text-center pt-4">+120%</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-[65%,35%] mt-[20px]">
                <div className="dark:bg-[#111c43] w-[94%] mt-[30px] h-[40vh] shadow-sm m-auto">
                    <OrderAnalytics isDashboard={true} />
                </div>
                <div className="p-5">
                    <h5 className="font-Poppins dark:text-[#fff] text-black text-[20px] pb-3 font-[400]">
                        {t("recent-transactions")}
                    </h5>
                    <AllInvoices isDashboard={true} />
                </div>
            </div>
        </div>
    );
};

export default DashboardWidgets;

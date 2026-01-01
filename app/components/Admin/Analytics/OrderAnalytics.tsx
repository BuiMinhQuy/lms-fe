import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
    BarChart,
    Bar,
    ResponsiveContainer,
    XAxis,
    Label,
    YAxis,
    LabelList,
    LineChart,
    CartesianAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Line,
} from "recharts";
import {
    useGetCoursesAnalyticsQuery,
    useGetOrdersAnalyticsQuery,
} from "../../../../redux/features/analytics/analyticsApi";
import Loader from "../../Loader/Loader";
import { styles } from "@/app/styles/style";
type Props = {
    isDashboard?: boolean;
};

const OrderAnalytics = ({ isDashboard }: Props) => {
    const { t } = useTranslation();
    const { data, isLoading, error } = useGetOrdersAnalyticsQuery({});
    const mockData = {
        success: true,
        orders: {
            last12Months: [
                {
                    month: "Feb 01, 2024",
                    count: 2,
                },
                {
                    month: "Mar 01, 2024",
                    count: 3,
                },
                {
                    month: "Apr 01, 2024",
                    count: 4,
                },
                {
                    month: "May 01, 2024",
                    count: 5,
                },
                {
                    month: "Jun 01, 2024",
                    count: 6,
                },
                {
                    month: "Jul 01, 2024",
                    count: 0,
                },
                {
                    month: "Aug 01, 2024",
                    count: 0,
                },
                {
                    month: "Sep 01, 2024",
                    count: 0,
                },
                {
                    month: "Oct 01, 2024",
                    count: 0,
                },
                {
                    month: "Nov 01, 2024",
                    count: 1,
                },
                {
                    month: "Dec 01, 2024",
                    count: 0,
                },
                {
                    month: "Jan 01, 2025",
                    count: 0,
                },
            ],
        },
    };

    useEffect(() => {}, []);
    const analyticsData: any = [];

    // if (mockData) {
    //     console.log('data', mockData);
    //     mockData && mockData.orders.last12Months.forEach((item: any) => {
    //         analyticsData.push({ name: item.name, Count: item.count })
    //     });
    // }

    if (data) {
        data &&
            data.orders.last12Months.forEach((item: any) => {
                analyticsData.push({ name: item.name, Count: item.count });
            });
    }
    //console.log("analyticsData", analyticsData);
    //console.log("data", data);

    const minValue = 0;
    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <div className={isDashboard ? "h-[30vh]" : "h-screen"}>
                    <div className={isDashboard ? "mt-[0px] pl-[40px] mb-2" : "mt-[50px]"}>
                        <h1 className={`${styles.title} px-5 ${isDashboard && "!text-[20px]"} px-5 !text-start`}>
                            {t("orders-analytics")}
                        </h1>
                        <p className={`${styles.label} px-5`}>{t("last-12-months")}</p>
                    </div>
                    <div className={`w-full ${!isDashboard ? "h-[90%]" : "h-full"} flex items-center justify-center`}>
                        <ResponsiveContainer width={isDashboard ? "100%" : "90%"} height={isDashboard ? "100%" : "50%"}>
                            <LineChart
                                width={150}
                                height={300}
                                data={analyticsData}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name"></XAxis>
                                <YAxis />
                                <Tooltip />
                                {!isDashboard && <Legend />}
                                <Line type="monotone" dataKey="Count" stroke="#82ca9d" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </>
    );
};

export default OrderAnalytics;

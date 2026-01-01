import { useGetUsersAnalyticsQuery } from "@/redux/features/analytics/analyticsApi";
import React from "react";
import { useTranslation } from "react-i18next";
import Loader from "../../Loader/Loader";
import { styles } from "@/app/styles/style";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Props = {
    isDashboard?: boolean;
};

const UsersAnalytics = ({ isDashboard }: Props) => {
    const { t } = useTranslation();
    const { data, isLoading } = useGetUsersAnalyticsQuery({});
    const analyticsData: any = [];

    // const data = [
    //     {
    //         month: 'Page A',
    //         uv: 4000,
    //         pv: 2400,
    //         amt: 2400,
    //     },
    //     {
    //         month: 'Page B',
    //         uv: 3000,
    //         pv: 1398,
    //         amt: 2210,
    //     },
    //     {
    //         month: 'Page C',
    //         uv: 2000,
    //         pv: 9800,
    //         amt: 2290,
    //     },
    //     {
    //         month: 'Page D',
    //         uv: 2780,
    //         pv: 3908,
    //         amt: 2000,
    //     },
    //     {
    //         month: 'Page E',
    //         uv: 1890,
    //         pv: 4800,
    //         amt: 2181,
    //     },
    //     {
    //         month: 'Page F',
    //         uv: 2390,
    //         pv: 3800,
    //         amt: 2500,
    //     },
    //     {
    //         month: 'Page G',
    //         uv: 3490,
    //         pv: 4300,
    //         amt: 2100,
    //     },
    // ];

    if (data) {
        data &&
            data.users.last12Months.forEach((item: any) => {
                analyticsData.push({ name: item.month, uv: item.count });
            });
        //console.log("data", data);
    }
    //console.log("analyticsData", analyticsData);
    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <div
                    className={`${!isDashboard ? "mt-[50px]" : "mt-[50px] dark:bg-[#111C43] shadow-sm pb-5 rounded-sm"}`}
                >
                    <div className={`${isDashboard ? "!ml-8 mb-5" : ""}`}>
                        <h1 className={`${styles.title} ${isDashboard && "!text-[20px]"} px-5 !text-start`}>
                            {t("users-analytics")}
                        </h1>
                        {!isDashboard && <p className={`${styles.label} px-5`}>{t("last-12-months")}</p>}
                    </div>
                    <div
                        className={`w-full ${isDashboard ? "h-[30vh]" : "h-screen"} flex items-center justify-center `}
                    >
                        <ResponsiveContainer width="70%" height="70%">
                            <AreaChart
                                width={500}
                                height={400}
                                data={analyticsData}
                                margin={{
                                    top: 10,
                                    right: 30,
                                    left: 0,
                                    bottom: 0,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </>
    );
};

export default UsersAnalytics;

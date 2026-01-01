import React from "react";
import { useTranslation } from "react-i18next";
import { BarChart, Bar, ResponsiveContainer, XAxis, Label, YAxis, LabelList } from "recharts";
import { useGetCoursesAnalyticsQuery } from "../../../../redux/features/analytics/analyticsApi";
import Loader from "../../Loader/Loader";
import { styles } from "@/app/styles/style";
type Props = {};

const CourseAnalytics = (props: Props) => {
    const { t } = useTranslation();
    const { data, isLoading, error } = useGetCoursesAnalyticsQuery({});
    // const analyticsData = [
    //   { name: "June 2023", uv: 3 },
    //   { name: "July 2023", uv: 2 },
    //   { name: "August 2023", uv: 5 },
    //   { name: "September 2023", uv: 7 },
    //   { name: "October 2023", uv: 2 },
    //   { name: "November 2023", uv: 5 },
    //   { name: "December 2023", uv: 7 },

    // ]
    const analyticsData: any = [];
    data &&
        data.courses.last12Months.forEach((item: any) => {
            analyticsData.push({ name: item.month, uv: item.count });
        });
    if (data) {
        //console.log("data", data);
    }
    const minValue = 0;
    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <div className="h-screen">
                    <div className="mt-[50px]">
                        <h1 className={`${styles.title} px-5  !text-start`}>{t("courses-analytics")}</h1>
                        <p className={`${styles.label}`}>{t("last-12-months")}</p>
                    </div>
                    <div className="w-full h-[90%] flex items-center justify-center">
                        <ResponsiveContainer width="90%" height="50%">
                            <BarChart width={150} height={300} data={analyticsData} barCategoryGap="30%">
                                <XAxis dataKey="name">
                                    <Label offset={0} position="insideBottom" />
                                </XAxis>
                                <YAxis domain={[minValue, "auto"]} />
                                <Bar dataKey="uv" fill="#3faf82">
                                    <LabelList dataKey="uv" position="top" />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </>
    );
};

export default CourseAnalytics;

"use client";
import ThemeSwitcher from "@/app/utils/ThemeSwitcher";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import { IoMdNotificationsOutline } from "react-icons/io";
import {
    useGetAllNotificationsQuery,
    useUpdateNotificationStatusMutation,
} from "@/redux/features/nofitications/notificationsApi";
import io from "socket.io-client";
import { format } from "timeago.js";
import { getSocketUrl, getApiUrl } from "@/app/utils/socketConfig";

const ENDPOINT = getApiUrl();
const socket = io(getSocketUrl(), {
    transports: ["websocket"],
});

type Props = {
    open?: boolean;
    setOpen?: any;
};
const DashboardHeader: FC<Props> = ({ open, setOpen }) => {
    const { t, i18n } = useTranslation();
    const [language, setLanguage] = useState(i18n.language === "vi" ? "vi" : "en");
    const { data, refetch } = useGetAllNotificationsQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });
    const [updateNotifcationStatus, { isSuccess }] = useUpdateNotificationStatusMutation();
    const [notifications, setNotifications] = useState<any>([]);
    const [audio] = useState(
        new Audio("https://res.cloudinary.com/damk25wo5/video/upload/v1693465789/notification_vcetjn.mp3")
    );

    useEffect(() => {
        if (typeof window !== "undefined") {
            i18n.changeLanguage(language);
        }
    }, [language, i18n]);

    const toggleLanguage = () => {
        const newLanguage = language === "en" ? "vi" : "en";
        setLanguage(newLanguage);
    };
    const playNotificationSound = () => {
        // audio.play();
    };
    useEffect(() => {
        if (data) {
            setNotifications(data.notifications.filter((item: any) => item.status === "unread"));
        }

        if (isSuccess) {
            refetch();
        }
        // audio.play();
    }, [data, isSuccess]);
    socket.on("newNotification", (data) => {
        console.log(data);
        refetch();
        playNotificationSound();
    });
    useEffect(() => {}, []);
    const handleNotificationStatusChange = async (id: string) => {
        await updateNotifcationStatus(id);
    };

    return (
        <div className="w-full flex items-center justify-end p-6 fixed top-5 right-0">
            <div
                className="relative inline-flex h-8 w-24 items-center rounded-full bg-gray-300 cursor-pointer p-1 mr-4"
                onClick={toggleLanguage}
            >
                {/* Toggle Ball */}
                <div
                    className={`absolute h-6 w-10 rounded-full shadow-md transition-all duration-300 ${
                        language === "vi"
                            ? "translate-x-12 bg-green-500 text-gray-600"
                            : "translate-x-0 bg-white text-black"
                    }`}
                ></div>

                {/* Text Labels */}
                <span
                    className={`z-10 w-1/2 text-center text-sm font-semibold ${
                        language === "en" ? "text-black" : "text-gray-400"
                    }`}
                >
                    EN
                </span>
                <span
                    className={`z-10 w-1/2 text-center text-sm font-semibold ${
                        language === "vi" ? "text-white" : "text-gray-400"
                    }`}
                >
                    VI
                </span>
            </div>
            <ThemeSwitcher />
            <div className="relative cursor-pointer m-2" onClick={() => setOpen(!open)}>
                <IoMdNotificationsOutline className="text-2xl cursor-pointer dark:text-white text-black" />
                <span className="absolute -top-2 -right-2 bg-[#3ccba0] rounded-full w-[20px] text-[12px] flex items-center justify-center text-white">
                    {notifications && notifications.length}
                </span>
            </div>
            {open && (
                <div className="w-[350px] h-[50vh] dark:bg-[#111C43] bg-white shadow-xl absolute top-16  rounded  !z-9999 overflow-auto">
                    <h5 className="text-center text-[20px] font-Poppins text-black dark:text-white p-3">
                        {t("notifications")}
                    </h5>
                    {notifications &&
                        notifications.map((item: any, index: number) => (
                            <div
                                key={item._id || index}
                                className="dark:bg-[#2d3a3ea1] bg-[#00000013] font-Poppins border-b dark:border-b-[#ffffff47] border-b-[#0000000f]"
                            >
                                <div className="w-full flex items-center justify-between p-2">
                                    <p className="text-black dark:text-white">{item.title}</p>
                                    <p
                                        className="text-black dark:text-white cursor-pointer"
                                        onClick={() => handleNotificationStatusChange(item._id)}
                                    >
                                        {t("mark-as-read")}
                                    </p>
                                </div>
                                <p className="px-2 text-black dark:text-white">{item.message}</p>
                                <p className="p-2 text-black dark:text-white text-[14px]">{format(item?.createdAt)}</p>
                            </div>
                        ))}

                    <div />
                </div>
            )}
        </div>
    );
};
export default DashboardHeader;

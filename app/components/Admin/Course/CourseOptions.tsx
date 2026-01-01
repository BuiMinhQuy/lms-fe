import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { IoMdCheckmark } from "react-icons/io";

type Props = {
    active: number;
    setActive: (active: number) => void;
    isEdit?: boolean;
};

const CourseOptions: FC<Props> = ({ active, setActive }) => {
    const { t } = useTranslation();
    const options = [t("course-information"), t("course-options"), t("course-content"), t("course-preview")];
    return (
        <div>
            {options.map((option: any, index: number) => (
                <div key={index} className={`w-full flex py-5 rounded-full`}>
                    <div
                        className={`w-[35px] h-[35px] rounded-full flex items-center justify-center ${
                            active + 1 > index ? "bg-blue-500" : "bg-[#384766]"
                        } relative`}
                    >
                        <IoMdCheckmark className="text-[25px]" />
                        {index !== options.length && (
                            <div
                                className={`absolute h-[30px] w-1 ${
                                    active + 1 > index ? "bg-blue-500" : "bg-[#384766]"
                                } bottom-[-100%]`}
                            />
                        )}
                    </div>
                    <h5
                        className={`pl-3 ${
                            active === index ? "dark:text-white text-black" : "dark:text-white text-bl;ack"
                        } text-[20px]`}
                    >
                        {option}
                    </h5>
                </div>
            ))}
        </div>
    );
};

export default CourseOptions;

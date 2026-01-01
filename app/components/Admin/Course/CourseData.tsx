import { styles } from "@/app/styles/style";
import { useTheme } from "next-themes";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { MdAddCircle } from "react-icons/md";

type Props = {
    benefits: { title: string }[];
    setBenefits: (benefits: { title: string }[]) => void;
    prerequisites: { title: string }[];
    setPrerequisites: (prerequisites: { title: string }[]) => void;
    active: number;
    setActive: (active: number) => void;
};

const CourseData: FC<Props> = ({ benefits, setBenefits, prerequisites, setPrerequisites, active, setActive }) => {
    const { t } = useTranslation();
    const handleBenefitChange = (index: number, value: any) => {
        const updatedBenefits = [...benefits];
        updatedBenefits[index].title = value;
        setBenefits(updatedBenefits);
    };
    const { theme } = useTheme();
    // console.log('thême',theme)
    const handlePrerequisitesChange = (index: number, value: any) => {
        const updatedPrerequisites = [...prerequisites];
        updatedPrerequisites[index].title = value;
        setPrerequisites(updatedPrerequisites);
    };

    const handleAddBenefit = () => {
        setBenefits([...benefits, { title: "" }]);
    };
    const handleAddPrerequisite = () => {
        setPrerequisites([...prerequisites, { title: "" }]);
    };
    const preButton = () => {
        setActive(active - 1);
    };
    const handleOption = () => {
        if (benefits[benefits.length - 1]?.title !== "" && prerequisites[prerequisites.length - 1]?.title !== "") {
            setActive(active + 1);
        } else {
            toast.error(t("please-fill-fields"));
        }
    };
    return (
        <div className="w-[80%] m-auto mt-24 block">
            <div>
                <label className={`${styles.label} text-[20px]`} htmlFor="email">
                    {t("benefits-question")}
                </label>
                <br />
                {benefits.map((benefit: any, index: number) => (
                    <input
                        type="text"
                        key={index}
                        name="Benefit"
                        placeholder={t("benefit-placeholder")}
                        onChange={(e) => handleBenefitChange(index, e.target.value)}
                        required
                        className={`${styles.input} my-2`}
                        value={benefit.title}
                    />
                ))}
                <MdAddCircle
                    style={{
                        margin: "10px 0px",
                        cursor: "pointer",
                        width: "30px",
                        color: `${theme == "dark" ? "white" : "black"}`,
                    }}
                    onClick={handleAddBenefit}
                />
            </div>
            <div>
                <label className={`${styles.label} text-[20px]`} htmlFor="email">
                    {t("prerequisites-question")}
                </label>
                <br />
                {prerequisites.map((prerequisite: any, index: number) => (
                    <input
                        type="text"
                        key={index}
                        name="Prerequisites"
                        placeholder={t("benefit-placeholder")}
                        onChange={(e) => handlePrerequisitesChange(index, e.target.value)}
                        required
                        className={`${styles.input} my-2`}
                        value={prerequisite.title}
                    />
                ))}
                <MdAddCircle
                    style={{
                        margin: "10px 0px",
                        cursor: "pointer",
                        width: "30px",
                        color: `${theme == "dark" ? "white" : "black"}`,
                    }}
                    onClick={handleAddPrerequisite}
                />
            </div>
            <div className="w-full flex items-center justify-between">
                <div
                    className="w-full 800px:w-[180px] flex items-center justify-center h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-8"
                    onClick={() => preButton()}
                >
                    {t("previous")}
                </div>
                <div
                    className="w-full 800px:w-[180px] flex items-center justify-center h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-8"
                    onClick={() => handleOption()}
                >
                    {t("next")}
                </div>
            </div>
        </div>
    );
};

export default CourseData;

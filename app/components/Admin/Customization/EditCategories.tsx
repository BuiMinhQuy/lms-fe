import { useGetHeroDataQuery, useUpdateLayoutMutation } from "@/redux/features/layout/layoutApi";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Loader from "../../Loader/Loader";
import { styles } from "@/app/styles/style";
import toast from "react-hot-toast";
import { AiOutlineDelete } from "react-icons/ai";
import { IoMdAddCircleOutline } from "react-icons/io";

type Props = {};

const EditCategories = (props: Props) => {
    const { t } = useTranslation();
    const { data, isLoading, refetch } = useGetHeroDataQuery("Categories", {
        refetchOnMountOrArgChange: true,
    });
    const [editLayout, { isSuccess: layoutSuccess, error }] = useUpdateLayoutMutation();
    const [categories, setCategories] = useState<any>([]);
    useEffect(() => {
        if (data) {
            setCategories(data.layout.categories);
        }
        if (layoutSuccess) {
            refetch();
            toast.success(t("categories-updated"));
        }
        if (error) {
            if ("data" in error) {
                const errorData = error as any;
                toast.error(errorData?.data?.message);
            }
        }
    }, [data, layoutSuccess, error]);
    const handleCategoriesAdd = (id: any, value: string) => {
        setCategories((prevCategory: any) =>
            prevCategory.map((i: any) => (i._id === id ? { ...id, title: value } : i))
        );
    };
    const newCategoriesHandler = () => {
        if (categories[categories.length - 1].title === "") {
            toast.error(t("category-empty-error"));
        } else {
            setCategories((prevCategory: any) => [...prevCategory, { title: "" }]);
        }
    };
    const areCategoriesUnchanged = (originalCategories: any[], newCategories: any[]) => {
        return JSON.stringify(originalCategories) === JSON.stringify(newCategories);
    };
    const isAnyCategoryTitleEmpty = (categories: any[]) => {
        //console.log("categories", categories);
        return categories?.some((q) => q.title === "");
    };
   // console.log("categories", categories);

    const editCategoriesHandler = async () => {
        if (!areCategoriesUnchanged(data.layout.categories, categories) && !isAnyCategoryTitleEmpty(categories)) {
            await editLayout({
                type: "Categories",
                categories,
            });
        }
    };
    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <div className="mt-[120px] text-center min-h-[100vh]">
                    <h1 className={`${styles.title}`}>{t("all-categories")}</h1>
                    {categories &&
                        categories.map((item: any) => {
                            return (
                                <div key={item._id || item.title} className="p-3">
                                    <div className="flex items-center w-full justify-center">
                                        <input
                                            className={`${styles.input} !w-[unset] !border-none !text-[20px]`}
                                            value={item.title}
                                            onChange={(e) => handleCategoriesAdd(item._id, e.target.value)}
                                            placeholder={t("enter-category-title")}
                                        />
                                        <AiOutlineDelete
                                            className="dark:text-white text-black text-[18px] cursor-pointer"
                                            onClick={() => {
                                                setCategories((prevCategory: any) =>
                                                    prevCategory.filter((i: any) => i._id !== item._id)
                                                );
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    <br />
                    <br />
                    <div className="w-full flex justify-center">
                        <IoMdAddCircleOutline
                            className="dark:text-white text-black text-[25px] cursor-pointer"
                            onClick={newCategoriesHandler}
                        />
                    </div>
                    <div
                        className={`${
                            styles.button
                        } !w-[100px] !min-h-[40px] !h-[40px] dark:text-white text-black bg-[#cccccc34]
                 
                 ${
                     areCategoriesUnchanged(data.layout.faq, categories) || isAnyCategoryTitleEmpty(categories)
                         ? "!cursor-not-allowed"
                         : "!cursor-pointer !bg-[#42d383]"
                 }
                 !rounded absolute bottom-12 right-12
                 `}
                        onClick={
                            areCategoriesUnchanged(data.layout.faq, categories) || isAnyCategoryTitleEmpty(categories)
                                ? () => null
                                : editCategoriesHandler
                        }
                    >
                        {t("save")}
                    </div>
                </div>
            )}
        </>
    );
};

export default EditCategories;

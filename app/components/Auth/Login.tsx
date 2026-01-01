"use client";

import React, { FC, useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { styles } from "@/app/styles/style";
import { AiFillGithub, AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { useTranslation } from "react-i18next";
import { useLoginMutation, useSocialAuthMutation } from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

type Props = {
    setRoute: (route: string) => void;
};

const schema = Yup.object().shape({
    email: Yup.string().email("Invalid email!").required("Please enter your email"),
    password: Yup.string().required("Please enter your password").min(6),
});

const Login: FC<Props> = ({ setRoute }) => {
    const { t } = useTranslation();
    const router = useRouter();

    const [login, { isError, data, isSuccess, error }] = useLoginMutation();
    const [socialAuth, { isSuccess: socialSuccess, error: socialError }] = useSocialAuthMutation();
    const [show, setShow] = useState(false);
    //console.log("check", process.env.GOOGLE_CLIENT_SECRET);

    // Formik for Local Login
    const formik = useFormik({
        initialValues: { email: "", password: "" },
        validationSchema: schema,
        onSubmit: async ({ email, password }) => {
            try {
                await login({ email, password });
            } catch (err) {
                console.error("Error during local login:", err);
            }
        },
    });

    const { errors, touched, values, handleChange, handleSubmit } = formik;

    // Handle post-login success or error
    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message || "Login successfully!");
            setRoute("/");
            router.push("/");
        }

        if (socialSuccess) {
            toast.success("Social login successfully!");
            setRoute("/");
            router.push("/");
        }

        if (socialError) {
            toast.error("Social login failed.");
        }
    }, [isSuccess, isError, socialSuccess, socialError]);
    // Handle click outside modal

    return (
        <div className="w-full">
            <h1 className={`${styles.title}`}>{t("login")}</h1>

            <form onSubmit={handleSubmit}>
                {/* Email */}
                <label className={`${styles.label}`} htmlFor="email">
                    {t("email")}
                </label>
                <input
                    type="email"
                    id="email"
                    value={values.email}
                    onChange={handleChange}
                    placeholder={t("email-placeholder") || ""}
                    className={`${errors.email && touched.email && "border-red-500"} ${styles.input}`}
                />
                {errors.email && touched.email && <span className="text-red-500 pt-2 block">{errors.email}</span>}

                {/* Password */}
                <div className="w-full mt-5 relative mb-1">
                    <label className={`${styles.label}`}>{t("password")}</label>
                    <input
                        type={show ? "text" : "password"}
                        id="password"
                        value={values.password}
                        onChange={handleChange}
                        placeholder={t("password-placeholder") || ""}
                        className={`${errors.password && touched.password && "border-red-500"} ${styles.input}`}
                    />
                    {!show ? (
                        <AiOutlineEyeInvisible
                            className="absolute bottom-3 right-2 z-1 cursor-pointer"
                            size={20}
                            onClick={() => setShow(true)}
                        />
                    ) : (
                        <AiOutlineEye
                            className="absolute bottom-3 right-2 z-1 cursor-pointer"
                            size={20}
                            onClick={() => setShow(false)}
                        />
                    )}
                </div>
                {errors.password && touched.password && (
                    <span className="text-red-500 pt-2 block">{errors.password}</span>
                )}

                {/* Submit Button */}
                <div className="w-full mt-5">
                    <input type="submit" value={t("btn-login") || "Login"} className={`${styles.button}`} />
                </div>
            </form>

            {/* Social Login */}
            <br />
            <h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white">{t("join-with")}</h5>
            <div className="flex items-center justify-center my-3">
                <FcGoogle size={30} className="cursor-pointer mr-2" onClick={() => signIn("google")} />
                <AiFillGithub size={30} className="cursor-pointer mr-2" onClick={() => signIn("github")} />
            </div>

            {/* Redirect to Signup */}
            <h5 className="text-center pt-4 font-Poppins text-[14px]">
                {t("not-have-account")}?{" "}
                <span className="text-[#2190ff] pl-1 cursor-pointer" onClick={() => setRoute("Signup")}>
                    {t("btn-sign-up")}
                </span>
            </h5>
        </div>
    );
};

export default Login;

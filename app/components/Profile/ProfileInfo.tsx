import React, { FC, useEffect, useState } from "react";
import Image from "next/image";
// import avatarIcon from "../../../public/images/avatar.png"; // Commented out due to corrupted file
import { styles } from "@/app/styles/style";
import { AiOutlineCamera } from "react-icons/ai";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { useUpdateAvatarMutation, useEditProfileMutation } from "@/redux/features/user/userApi";
import toast from "react-hot-toast";

type Props = {
    avatar: string | null;
    user: any;
};

const ProfileInfo: FC<Props> = ({ user, avatar }) => {
    const [name, setName] = useState(user && user.name);
    const [updateAvatar, { isSuccess, error }] = useUpdateAvatarMutation();
    const [editProfile, { isSuccess: success, error: updateError }] = useEditProfileMutation();

    const [loadUser, setLoadUser] = useState(false);
    const {} = useLoadUserQuery(undefined, { skip: loadUser ? false : true });

    // console.log('user', user);

    const imageHandler = async (e: any) => {
        // const file = e.target.files[0];
        // console.log(file);
        const fileReader = new FileReader();
        fileReader.onload = () => {
            const avatar = fileReader.result;
            if (fileReader.readyState === 2) {
                updateAvatar(avatar);
            }
        };
        fileReader.readAsDataURL(e.target.files[0]);
    };

    useEffect(() => {
        if (isSuccess) {
            setLoadUser(true);
        }
        if (error || updateError) {
            // console.log(error);
        }
        if (success) {
            toast.success("Profile updated successfully!");
        }
    }, [isSuccess, error, success, updateError]);
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (name !== "") {
            await editProfile({
                name: name,
            });
        }
    };
    return (
        <>
            <div className="flex-1 flex flex-col items-center justify-center">
                <div className="relative">
                    <Image
                                                        src={avatar || "/images/business.png"}
                        alt="avatar"
                        width={120}
                        height={120}
                        className="w-[120px] h-[120px] cursor-pointer border-[3px] border-[#37a39a] rounded-full object-cover"
                    />
                    <input
                        type="file"
                        className="hidden"
                        name=""
                        id="avatar"
                        required
                        onChange={imageHandler}
                        accept="image/png,image/jpg,image/jpeg,image/webp"
                    />
                    <label htmlFor="avatar">
                        <div className="w-[30px] absolute h-[30px] bg-slate-900 rounded-full bottom-2 right-2 flex items-center justify-center cursor-pointer">
                            <AiOutlineCamera size={20} className="z-1" />
                        </div>
                    </label>
                </div>
                <div className="w-full pl-6 800px:pl-10">
                    <form onSubmit={handleSubmit}>
                        <div className="800px:w-[50%] m-auto block pb-4">
                            <div className="w-100%">
                                <label className="block pb-2">Full Name</label>
                                <input
                                    type="text"
                                    className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="w-100% pt-2">
                                <label className="block pb-2">Email Address</label>
                                <input
                                    type="text"
                                    className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                                    readOnly
                                    value={user?.email}
                                />
                            </div>
                            <input
                                type="submit"
                                className={`w-full 800px:w-[250px] h-[40px] border border-[#37a39a] text-center dark:text-[#fff] text-black rounded-[3px] mt-8 cursor-pointer`}
                                readOnly
                                value="Update"
                            />
                        </div>
                    </form>
                    <br />
                </div>
            </div>
            <br />
            <br />
        </>
    );
};

export default ProfileInfo;

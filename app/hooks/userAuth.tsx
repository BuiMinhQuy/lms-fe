import React from "react";
import { useSelector } from "react-redux";

function useUserAuth() {
    const { user } = useSelector((state: any) => state.auth);
    if (user) {
        return true;
    } else {
        return false;
    }
}

export default useUserAuth;

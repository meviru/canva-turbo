"use client";

import { useSaveUserMutation } from "@/services/user.service";
import { setUser } from "@/store/slices/userSlice";
import { useUser } from "@stackframe/stack";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
    const user = useUser();
    const dispatch = useDispatch();

    const [saveUser] = useSaveUserMutation();
    const hasSaved = useRef(false);

    useEffect(() => {
        if (!hasSaved.current) {
            hasSaved.current = true;
            saveUserInfo(user);
        }
    }, [user, saveUser]);

    const saveUserInfo = async (user: any) => {
        try {
            const savedUser = await saveUser({
                authId: user.id,
                name: user.displayName,
                email: user.primaryEmail,
                image: user.profileImageUrl,
            }).unwrap();

            dispatch(setUser(savedUser?.user));
            localStorage.setItem("user", JSON.stringify(savedUser?.user));
        } catch (error) {
            console.error("Failed to save user:", error);
        }
    }

    return <>{children}</>;
};

export default AuthWrapper;

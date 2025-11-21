"use client";

import { useSaveUserMutation } from "@/services/user.service";
import { setUser } from "@/store/slices/userSlice";
import { setUserToStorage } from "@/shared/lib/storage";
import type { User } from "@/shared/models";
import { useUser } from "@stackframe/stack";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

interface StackUser {
    id: string;
    displayName: string;
    primaryEmail: string;
    profileImageUrl?: string;
}

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
    const user = useUser() as StackUser | null;
    const dispatch = useDispatch();

    const [saveUser] = useSaveUserMutation();
    const hasSaved = useRef(false);

    useEffect(() => {
        if (user && !hasSaved.current) {
            hasSaved.current = true;
            saveUserInfo(user);
        }
    }, [user, saveUser]);

    const saveUserInfo = async (user: StackUser) => {
        if (!user || !user.id) {
            console.warn("User is null or missing required properties");
            return;
        }

        try {
            const savedUser = await saveUser({
                authId: user.id,
                name: user.displayName,
                email: user.primaryEmail,
                image: user.profileImageUrl,
            }).unwrap();

            const userData: User = savedUser?.user;
            dispatch(setUser(userData));
            setUserToStorage(userData);
        } catch (error) {
            console.error("Failed to save user:", error);
        }
    }

    return <>{children}</>;
};

export default AuthWrapper;

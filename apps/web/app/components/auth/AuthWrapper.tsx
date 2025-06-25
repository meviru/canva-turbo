"use client";

import { useSaveUserMutation } from "@/services/user.service";
import { useUser } from "@stackframe/stack";
import { redirect } from "next/navigation";
import { useEffect, useRef } from "react";

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
    const user = useUser();
    const [saveUser] = useSaveUserMutation();
    const hasSaved = useRef(false);

    useEffect(() => {
        if (!user) {
            redirect("/handler/sign-in");
        }

        if (!hasSaved.current) {
            hasSaved.current = true;
            saveUser({
                authId: user.id,
                name: user.displayName,
                email: user.primaryEmail,
                image: user.profileImageUrl,
            })
                .unwrap()
                .then(() => {
                    redirect("/workspace"); // Only redirect after save
                })
                .catch((err) => {
                    console.error("Error saving user:", err);
                });
        }
    }, [user, saveUser]);

    return <>{children}</>;
};

export default AuthWrapper;

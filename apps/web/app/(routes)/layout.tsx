import AuthWrapper from "@/components/auth/AuthWrapper";

export default function RoutesLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthWrapper>
            {children}
        </AuthWrapper>
    );
}

import { cn } from "@/shared/lib/utils";
import Sidebar from "./components/Sidebar";

const WorkspaceLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div
            className={cn(
                "flex",
                "bg-violet-50",
                "dark:bg-[linear-gradient(180deg,_#1d063f_0%,_#03152c_100%)]"
            )}
        >
            <Sidebar />
            <div className="p-[7px] pl-0 pb-0 grow">{children}</div>
        </div>
    );
};

export default WorkspaceLayout;

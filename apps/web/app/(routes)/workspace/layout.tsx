import Sidebar from "./components/Sidebar";

const WorkspaceLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex bg-violet-50">
            <Sidebar />
            <div className="p-[7px] pl-0 pb-0 grow">{children}</div>
        </div>
    );
};

export default WorkspaceLayout;

import Sidebar from "./components/Sidebar";

const WorkspaceLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex" style={{
            background: `linear-gradient(180deg, #1d063f 0%, #03152c 100%)`
        }}>
            <Sidebar />
            <div className="p-[7px] pl-0 pb-0 grow">{children}</div>
        </div>
    );
};

export default WorkspaceLayout;

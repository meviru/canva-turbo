import CanvasEditor from "../components/CanvasEditor"
import DesignerHeader from "../components/DesignerHeader"
import DesignSidebar from "../components/DesignerSidebar"

const DesignEditor = () => {
    const designInfo = {
        name: "Untitled Design",
        width: 500,
        height: 500
    }
    return (
        <div className="flex flex-col h-screen bg-gray-100 dark:bg-[#0d1216]">
            <DesignerHeader designInfo={designInfo} />
            <div className="flex flex-1 overflow-hidden">
                <DesignSidebar />
                <div className="flex-1 overflow-auto">
                    <CanvasEditor designInfo={designInfo} />
                </div>
            </div>
        </div>
    )
}

export default DesignEditor
import DesignerHeader from "../components/DesignerHeader"
import DesignSidebar from "../components/DesignerSidebar"

const DesignEditor = () => {
    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <DesignerHeader />
            <div className="flex flex-1 overflow-hidden">
                <DesignSidebar />
                <div className="flex-1 overflow-auto">
                    
                </div>
            </div>
        </div>
    )
}

export default DesignEditor
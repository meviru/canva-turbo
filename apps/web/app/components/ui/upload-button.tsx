import { IconDots, IconLoaderQuarter } from "@tabler/icons-react"
import { Button } from "./button"

const UploadButton = ({ loading, fileInputRef, handleUpload }: any) => {
    return (
        <div className="flex gap-1.5 mb-3">
            <div className="relative grow-1">
                <label htmlFor="uploadImage">
                    <h2 className="px-2 text-sm h-10 leading-10 flex items-center justify-center bg-primary rounded-md cursor-pointer">
                        {loading ? (
                            <>
                                <IconLoaderQuarter className="animate-spin" />
                                <span className="ml-2">Uploading</span>
                            </>
                        ) : (
                            "Upload Image"
                        )}
                    </h2>
                </label>
                <input
                    id="uploadImage"
                    className="hidden"
                    type="file"
                    ref={fileInputRef}
                    multiple={false}
                    onChange={handleUpload}
                />
            </div>
            <Button size="icon" className="p-0 shrink-0 h-10 w-10 text-white cursor-pointer">
                <IconDots className="size-5" />
            </Button>
        </div>
    )
}

export default UploadButton
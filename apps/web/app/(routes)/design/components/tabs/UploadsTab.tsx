import { Button } from "@/components/ui/button";
import { useLazyListFilesQuery, useUploadFileMutation } from "@/services/upload.service";
import { IconDots, IconLoaderQuarter } from "@tabler/icons-react";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import TabHeader from "./TabHeader";
import TabSearchBox from "./TabSearchBox";

const UploadsTab = () => {
    const user = useSelector((state: any) => state.user);
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadFile] = useUploadFileMutation();
    const [listFiles] = useLazyListFilesQuery();

    const handleUpload = async () => {
        const fileInput = fileInputRef.current;
        if (!fileInput || !fileInput.files?.length) {
            toast("Please select a file to upload", {
                position: "top-right",
            });
            return;
        }

        setLoading(true);
        const file: any = fileInput.files[0];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("userId", user._id as string);
        try {
            const response = await uploadFile({ formData }).unwrap();
            toast.success("File uploaded successfully", {
                position: "top-right",
            });
            fileInputRef.current!.value = '';
            console.log("Upload response:", response);
        } catch (error) {
            toast.error("File upload failed", {
                position: "top-right",
            });
            console.error("Upload error:", error);
        } finally {
            setLoading(false);
            listFiles({ userId: user._id as string })
        }
    };

    return (
        <div className="flex flex-col h-full">
            <TabHeader>
                <TabSearchBox placeholder="Search uploaded images" value={searchValue} onChange={(value) => { setSearchValue(value) }} />
                <div className="flex gap-1.5">
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
            </TabHeader>
            <div className="grow overflow-y-auto"></div>
        </div>
    )
}

export default UploadsTab
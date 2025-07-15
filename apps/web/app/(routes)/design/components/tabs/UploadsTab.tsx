import UploadButton from "@/components/ui/upload-button";
import { useListFilesQuery, useUploadFileMutation } from "@/services/upload.service";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import TabHeader from "./TabHeader";
import TabSearchBox from "./TabSearchBox";
import { useGroupedPhotos } from "@/hooks/useGroupedPhotos";
import PhotoItem from "@/components/ui/photo-item";
import { useCanvas } from "@/hooks/useCanvas";

const UploadsTab = () => {
    const user = useSelector((state: any) => state.user);
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [groupedRows, setGroupedRows] = useState<any[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadFile] = useUploadFileMutation();
    const { data: filesData } = useListFilesQuery({ userId: user._id }, {
        skip: !user._id
    });

    const { addImage } = useCanvas();

    const files = useGroupedPhotos(filesData?.data);

    useEffect(() => {
        setGroupedRows(files);
    }, [files]);

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
        }
    };

    const hasGroupedRows = groupedRows && groupedRows.length > 0;

    return (
        <div className="flex flex-col h-full">
            <TabHeader>
                <TabSearchBox placeholder="Search uploaded images" value={searchValue} onChange={(value) => { setSearchValue(value) }} />
                <UploadButton loading={loading} fileInputRef={fileInputRef} handleUpload={handleUpload} />
            </TabHeader>
            <div className="grow overflow-y-auto p-4 pt-0 space-y-2">
                {hasGroupedRows && groupedRows.map((row, rowIndex) => {
                    return (
                        <div key={rowIndex} className="flex gap-2 w-full overflow-hidden">
                            {row.map((photo: any) =>
                                <PhotoItem key={photo._id} uploadedPhoto={photo} addImage={addImage} rowLength={row.length} />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default UploadsTab
import PhotoItem from "@/components/ui/photo-item";
import { useGroupedPhotos } from "@/hooks/useGroupedPhotos";
import { useGetPhotosQuery } from "@/services/photos.service";
import { useEffect, useState } from "react";
import TabHeader from "./TabHeader";
import TabSearchBox from "./TabSearchBox";

const PhotosTab = () => {
    const [searchValue, setSearchValue] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState<any>("");

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchValue);
        }, 1000);
        return () => clearTimeout(handler);
    }, [searchValue]);

    const { data, isLoading } = useGetPhotosQuery(debouncedSearch, {
        skip: debouncedSearch && debouncedSearch.length < 3,
    });

    const groupedRows = useGroupedPhotos(data?.results || []);

    return (
        <div className="flex flex-col h-full">
            <TabHeader>
                <TabSearchBox
                    placeholder="Search photos"
                    value={searchValue}
                    onChange={(value) => setSearchValue(value)}
                />
            </TabHeader>

            <div className="grow overflow-y-auto p-4 pt-0 space-y-2">
                {groupedRows.map((row, rowIndex) => {
                    return (
                        <div key={rowIndex} className="flex gap-2 w-full overflow-hidden">
                            {row.map((photo) =>
                                <PhotoItem key={photo.id} photo={photo} rowLength={row.length} />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PhotosTab;

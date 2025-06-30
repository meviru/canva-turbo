import { useEffect, useState } from "react";
import TabHeader from "./TabHeader";
import TabSearchBox from "./TabSearchBox";
import { useGetPhotosQuery } from "@/services/photos.service";
import { useGroupedPhotos } from "@/hooks/useGroupedPhotos";
import PhotoItem from "@/components/ui/photo-item";

const PhotosTab = () => {
    const [searchValue, setSearchValue] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState<any>("");

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchValue);
        }, 400);
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
                {isLoading && <p className="text-sm text-gray-500">Loading...</p>}
                {!isLoading &&
                    groupedRows.map((row, rowIndex) => {
                        const itemCount = row.length;

                        let rowHeight = 160;
                        if (itemCount >= 4) rowHeight = 100;
                        else if (itemCount === 3) rowHeight = 110;
                        else if (itemCount === 2) rowHeight = 140;

                        return (
                            <div key={rowIndex} className="flex gap-3 w-full overflow-hidden">
                                {row.map((photo) => {
                                    const isLandscape = photo.width > photo.height;
                                    const flexValue = isLandscape ? 1.6 : 1;

                                    return (
                                        <PhotoItem key={photo.id} photo={photo} rowLength={row.length} />
                                    );
                                })}
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
};

export default PhotosTab;

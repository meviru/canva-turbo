import { useEffect, useState } from "react";
import TabHeader from "./TabHeader";
import TabSearchBox from "./TabSearchBox";
import { useGetPhotosQuery } from "@/services/photos.service";
import { useGroupedPhotos } from "@/hooks/useGroupedPhotos";

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

            <div className="grow overflow-y-auto p-4 space-y-2">
                {isLoading && <p className="text-sm text-gray-500">Loading...</p>}
                {!isLoading &&
                    groupedRows.map((row, rowIndex) => {
                        let height = 160;
                        if (row.length >= 4) height = 100;
                        else if (row.length === 3) height = 110;
                        else if (row.length === 2) height = 140;

                        const getWidths = () => {
                            if (row.length === 4) return Array(4).fill(1);
                            if (row.length === 3) return [2, 1, 1];
                            if (row.length === 2) return [1.5, 1];
                            return [1];
                        };

                        const widths = getWidths();

                        return (
                            <div
                                key={rowIndex}
                                className="flex gap-2 w-full overflow-hidden"
                                style={{ height }}
                            >
                                {row.map((photo, i) => (
                                    <div
                                        key={photo.id}
                                        className="rounded-xs overflow-hidden"
                                        style={{
                                            flexGrow: widths[i],
                                            flexShrink: 1,
                                            flexBasis: 0,
                                            minWidth: 0,
                                        }}
                                    >
                                        <img
                                            src={photo.urls.small}
                                            alt={photo.alt_description}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
};

export default PhotosTab;

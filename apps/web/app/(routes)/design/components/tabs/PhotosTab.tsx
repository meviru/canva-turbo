"use client";

import { useEffect, useState } from "react";
import TabHeader from "./TabHeader";
import TabSearchBox from "./TabSearchBox";
import { useGetPhotosQuery } from "@/services/photos.service";

const PhotosTab = () => {
    const DEFAULT_SEARCH = "random";
    const [searchValue, setSearchValue] = useState<any>(DEFAULT_SEARCH);
    const [debouncedSearch, setDebouncedSearch] = useState<any>(DEFAULT_SEARCH);

    // Debounce logic
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchValue);
        }, 400);

        return () => clearTimeout(handler);
    }, [searchValue]);

    const { data, isLoading } = useGetPhotosQuery(debouncedSearch, {
        skip: debouncedSearch && debouncedSearch.length < 3,
    });

    return (
        <div className="flex flex-col h-full">
            <TabHeader>
                <TabSearchBox
                    placeholder="Search photos"
                    value={searchValue}
                    onChange={(value) => setSearchValue(value)}
                />
            </TabHeader>

            <div className="grow overflow-y-auto p-4 space-y-4">
                {isLoading && <p className="text-sm text-gray-500">Loading photos...</p>}
                {!isLoading && data?.results?.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {data.results.map((photo: any) => (
                            <img
                                key={photo.id}
                                src={photo.urls.small}
                                alt={photo.alt_description}
                                className="rounded-lg object-cover w-full h-40"
                            />
                        ))}
                    </div>
                )}
                {!isLoading && data?.results?.length === 0 && (
                    <p className="text-sm text-gray-500">No photos found.</p>
                )}
            </div>
        </div>
    );
};

export default PhotosTab;

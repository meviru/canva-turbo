import PhotoItem from "@/components/ui/photo-item";
import { useGroupedPhotos } from "@/hooks/useGroupedPhotos";
import { useGetPhotosQuery } from "@/services/photos.service";
import { useEffect, useMemo, useRef, useState } from "react";
import TabHeader from "./TabHeader";
import TabSearchBox from "./TabSearchBox";

const PhotosTab = () => {
    const [searchValue, setSearchValue] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState<any>("");

    const [photos, setPhotos] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [isInitialLoaded, setIsInitialLoaded] = useState(false);
    const [ready, setReady] = useState(false);

    const containerRef = useRef<HTMLDivElement | null>(null);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    const queryParams = useMemo(() => ({
        q: debouncedSearch,
        page,
        perPage: 30,
    }), [debouncedSearch, page]);

    const { data, isLoading } = useGetPhotosQuery(queryParams, {
        skip: debouncedSearch && debouncedSearch.length < 3,
    });

    // Debounce search input
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchValue);
        }, 1000);
        return () => clearTimeout(handler);
    }, [searchValue]);

    // Reset on new search
    useEffect(() => {
        if (debouncedSearch) {
            setPhotos([]);
            setPage(1);
            setTotalPages(1);
            setIsInitialLoaded(false);
            setReady(false);
        }
    }, [debouncedSearch]);

    // Update photos on data load
    useEffect(() => {
        if (data?.results) {
            if (page === 1) {
                setPhotos(data.results);
                setIsInitialLoaded(true);
                setReady(true);
            } else {
                setPhotos(prev => [...prev, ...data.results]);
            }
            setTotalPages(data.total_pages || 1);
            setIsFetchingMore(false);
        }
    }, [data, page]);

    // Infinite scroll using IntersectionObserver
    useEffect(() => {
        const sentinel = loadMoreRef.current;
        const container = containerRef.current;
        if (!sentinel || !container) return;

        const observer = new IntersectionObserver(
            (entries: any) => {
                if (
                    entries[0].isIntersecting &&
                    isInitialLoaded &&
                    !isLoading &&
                    !isFetchingMore &&
                    page < totalPages &&
                    ready
                ) {
                    setIsFetchingMore(true);
                    setPage(prev => prev + 1);
                }
            },
            {
                root: container,
                rootMargin: "0px",
                threshold: 1.0,
            }
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [isLoading, isFetchingMore, page, totalPages, ready, isInitialLoaded]);

    const groupedRows = useGroupedPhotos(photos);

    return (
        <div className="flex flex-col h-full">
            <TabHeader>
                <TabSearchBox
                    placeholder="Search photos"
                    value={searchValue}
                    onChange={(value) => setSearchValue(value)}
                />
            </TabHeader>

            <div ref={containerRef} className="grow overflow-y-auto p-4 pt-0 space-y-2">
                {groupedRows.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex gap-2 w-full overflow-hidden">
                        {row.map((photo) => (
                            <PhotoItem key={photo.id} photo={photo} rowLength={row.length} />
                        ))}
                    </div>
                ))}

                {/* Spinner while fetching more */}
                {isFetchingMore && (
                    <div className="flex justify-center py-4">
                        <div className="h-6 w-6 border-2 border-t-transparent border-gray-500 rounded-full animate-spin" />
                    </div>
                )}

                {/* Sentinel */}
                <div ref={loadMoreRef} className="h-10" />
            </div>
        </div>
    );
};

export default PhotosTab;

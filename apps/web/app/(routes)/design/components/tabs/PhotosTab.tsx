import PhotoItem from "@/components/ui/photo-item";
import { useGroupedPhotos } from "@/hooks/useGroupedPhotos";
import { useGetPhotosQuery } from "@/services/photos.service";
import { useEffect, useRef, useState } from "react";
import TabHeader from "./TabHeader";
import TabSearchBox from "./TabSearchBox";

// Custom throttle without lodash
function throttle(fn: () => void, delay: number) {
    let lastCall = 0;
    return () => {
        const now = Date.now();
        if (now - lastCall >= delay) {
            lastCall = now;
            fn();
        }
    };
}

const PhotosTab = () => {
    const [searchValue, setSearchValue] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState<any>("");

    const [photos, setPhotos] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    const { data, isLoading } = useGetPhotosQuery(
        { q: debouncedSearch, page, perPage: 30 },
        {
            skip: debouncedSearch && debouncedSearch.length < 3,
        }
    );

    useEffect(() => {
        if (data?.results) {
            setPhotos(prev =>
                page === 1 ? data.results : [...prev, ...data.results]
            );
            setTotalPages(data.total_pages || 1);
            setIsFetchingMore(false);
        }
    }, [data, page]);

    const groupedRows = useGroupedPhotos(photos);
    const containerRef = useRef<HTMLDivElement | null>(null);

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
            setPage(1);
            setPhotos([]);
            setTotalPages(1);
        }
    }, [debouncedSearch]);

    // Infinite scroll with throttle
    useEffect(() => {
        const handleScroll = throttle(() => {
            const container = containerRef.current;
            if (
                !container ||
                isLoading ||
                isFetchingMore ||
                page >= totalPages
            )
                return;

            const { scrollTop, scrollHeight, clientHeight } = container;
            if (scrollTop + clientHeight >= scrollHeight - 100) {
                setIsFetchingMore(true);
                setPage(prev => prev + 1);
            }
        }, 300);

        const container = containerRef.current;
        container?.addEventListener("scroll", handleScroll);
        return () => container?.removeEventListener("scroll", handleScroll);
    }, [isLoading, isFetchingMore, page, totalPages]);

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
            </div>
        </div>
    );
};

export default PhotosTab;

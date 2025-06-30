"use client";

import clsx from "clsx";
import React, { useState } from "react";

interface PhotoItemProps {
    photo: any;
    rowLength: number;
}

const PhotoItem: React.FC<PhotoItemProps> = ({ photo, rowLength }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const isLandscape = photo.width > photo.height;

    // Dynamic height
    let height = 160;
    if (rowLength >= 4) height = 100;
    else if (rowLength === 3) height = 110;
    else if (rowLength === 2) height = 140;

    const flex = isLandscape ? 1.6 : 1;

    return (
        <div
            className={clsx(
                "relative overflow-hidden rounded-xs cursor-pointer bg-zinc-200 dark:bg-zinc-800",
                !isLoaded && "animate-pulse"
            )}
            style={{
                flex,
                height,
                minWidth: 0,
            }}
        >
            <img
                src={photo.urls.small}
                alt={photo.alt_description || "photo"}
                loading="lazy"
                onLoad={() => setIsLoaded(true)}
                className={clsx(
                    "w-full h-full object-cover transition-opacity duration-300",
                    isLoaded ? "opacity-100" : "opacity-0"
                )}
            />
        </div>
    );
};

export default PhotoItem;

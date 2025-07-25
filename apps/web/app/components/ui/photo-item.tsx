"use client";

import clsx from "clsx";
import React, { useState } from "react";

interface PhotoItemProps {
    photo?: any;
    uploadedPhoto?: any;
    rowLength: number;
    addImage: (imageUrl: string) => Promise<void>;
}

const PhotoItem: React.FC<PhotoItemProps> = ({ photo, uploadedPhoto, rowLength, addImage }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const isLandscape = uploadedPhoto ? uploadedPhoto.width > uploadedPhoto.height : photo.width > photo.height;

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
                src={uploadedPhoto ? uploadedPhoto.url : photo.urls.small}
                alt={uploadedPhoto ? uploadedPhoto.name : photo.alt_description || "photo"}
                loading="lazy"
                onLoad={() => setIsLoaded(true)}
                onClick={() => uploadedPhoto ? addImage(uploadedPhoto.url) : addImage(photo.urls.full)}
                className={clsx(
                    "w-full h-full object-cover transition-opacity duration-300",
                    isLoaded ? "opacity-100" : "opacity-0"
                )}
            />
        </div>
    );
};

export default PhotoItem;

"use client";
import { useState } from "react";

const PhotoItem = ({
    src,
    alt,
    style,
}: {
    src: string;
    alt: string;
    style?: React.CSSProperties;
}) => {
    const [loaded, setLoaded] = useState(false);

    return (
        <div
            className="relative cursor-pointer rounded-xs overflow-hidden bg-gray-200"
            style={style}
        >
            {!loaded && (
                <div className="absolute inset-0 bg-gray-300 animate-pulse z-10" />
            )}
            <img
                loading="lazy"
                src={src}
                alt={alt}
                className={`w-full h-full object-cover object-center transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"
                    }`}
                onLoad={() => setLoaded(true)}
            />
        </div>
    );
};

export default PhotoItem;

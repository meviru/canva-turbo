"use client";

import { CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import { useGetDesignsQuery } from "@/services/design.service";
import { Card } from "@repo/ui/card";
import Image from "next/image";
import emptyStateImage from "public/empty-state.webp";
import placeholderImage from "public/placeholder-image.png";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const RecentDesigns = () => {
    const user = useSelector((state: any) => state.user);
    const [designList, setDesignList] = useState([]);
    const { data, isLoading } = useGetDesignsQuery(user?._id, {
        skip: !user?._id,
    });

    useEffect(() => {
        if (data && data.designs) {
            setDesignList(data.designs);
        }
    }, [data, isLoading]);

    return (
        <div className="mt-7">
            <h2 className="text-2xl font-semibold">Recent Designs</h2>
            {designList?.length === 0 ? (
                <div className="flex flex-col items-center justify-center">
                    <Image
                        src={emptyStateImage}
                        alt="Empty state"
                        width={150}
                        height={150}
                    />
                    <h2 className="text-xl font-semibold mt-4">No designs found</h2>
                    <p className="text-sm text-center text-muted-foreground mt-2 mb-5">
                        You haven't created any designs yet. <br />Start a new project to begin crafting your ideas.
                    </p>
                </div>
            ) : (
                <div className="grid xl:grid-cols-6 lg:grid-cols-4 sm:grid-cols-2 gap-5 mt-4">
                    {designList?.map((design: any, i) => (
                        <Card
                            key={i}
                            href={`/design/${design.id}`}
                            title={""}
                            className="cursor-pointer shadow-none border-0">
                            <CardContent className="p-4 flex items-center justify-center bg-gray-200 overflow-hidden rounded-xl">
                                <Image
                                    src={design.image || placeholderImage}
                                    alt={design.name}
                                    width={200}
                                    height={160}
                                    className="object-cover w-full h-full"
                                />
                            </CardContent>
                            <CardFooter className="p-0 flex flex-col items-start gap-1.5 mt-4">
                                <CardTitle>{design.name}</CardTitle>
                                <CardDescription>
                                    {design.width} x {design.height}
                                </CardDescription>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RecentDesigns;

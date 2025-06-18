"use client";

import { CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import { Card } from "@repo/ui/card";
import Image from "next/image";
import emptyStateImage from "public/empty-state.webp";
import { useState } from "react";

const RecentDesigns = () => {
    const [designList, setDesignList] = useState([]);

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
                    <p className="text-center mt-2 mb-5">
                        You haven't created any designs yet. <br />Start a new project to begin crafting your ideas.
                    </p>
                </div>
            ) : (
                <div className="grid xl:grid-cols-6 lg:grid-cols-4 sm:grid-cols-2 gap-5 mt-4">
                    {designList?.map((design: any, i) => (
                        <Card
                            title=""
                            key={i}
                            href={`/design/${design.id}`}
                            className="cursor-pointer shadow-none border-0"
                        >
                            <CardContent className="p-4 flex items-center justify-center bg-gray-200 overflow-hidden rounded-xl">
                                <Image
                                    src={"https://placehold.co/400"}
                                    alt={design.name}
                                    width={200}
                                    height={160}
                                    className="object-contain"
                                />
                            </CardContent>
                            <CardFooter className="p-0 flex flex-col items-start gap-1.5">
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

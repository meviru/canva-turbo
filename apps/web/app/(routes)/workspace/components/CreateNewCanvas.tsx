"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { IconLoader } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const CreateNewCanvas = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();

    const [name, setName] = useState<string | null>();
    const [width, setWidth] = useState<string | null>();
    const [height, setHeight] = useState<string | null>();

    const [loading, setLoading] = useState(false);

    const onCreate = async () => {
        toast("Creating new design...");
        setLoading(true);
        setLoading(false);
        resetForm();
        const id = null;
        router.push(`/design/${id}`);
    };

    const resetForm = () => {
        setName(null);
        setWidth(null);
        setHeight(null);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a design</DialogTitle>
                    <DialogDescription asChild>
                        <div className="flex flex-col">
                            <h2 className="text-sm">Custom canvas width and height</h2>
                            <div className="flex flex-col gap-3.5 mt-5">
                                <div className="flex flex-col">
                                    <label htmlFor="designName">Design Name</label>
                                    <Input
                                        className="mt-1"
                                        id="designName"
                                        placeholder="Design Name"
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3.5">
                                    <div className="flex flex-col">
                                        <label htmlFor="width">Width</label>
                                        <Input
                                            className="mt-1"
                                            type="number"
                                            id="width"
                                            placeholder="500"
                                            onChange={(e) => setWidth(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="height">Height</label>
                                        <Input
                                            className="mt-1"
                                            type="number"
                                            id="height"
                                            placeholder="500"
                                            onChange={(e) => setHeight(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end mt-3">
                                    <Button
                                        className="flex items-center justify-center cursor-pointer"
                                        disabled={loading || !name || !width || !height}
                                        onClick={onCreate}
                                    >
                                        {loading && <IconLoader className="mr-1 animate-spin" />}
                                        {loading ? "Creating..." : "Create"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default CreateNewCanvas
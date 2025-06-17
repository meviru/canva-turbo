import Image from "next/image";
import headerBg from "public/header-bg.webp";

const Heading = () => {
    return (
        <>
            <div
                className="absolute inset-0 -z-10 rounded-2xl max-h-60"
                style={{
                    background:
                        " radial-gradient(ellipse 72% 150% at 50% 100%, #ffffff, hsla(0, 0%, 100%, 0)), linear-gradient(to bottom, hsla(0, 0%, 100%, 0) 0%, hsla(0, 0%, 100%, 0) 9.5%, #ffffff 94%), linear-gradient(rgba(255, 255, 255, 0.35), rgba(255, 255, 255, 0.35)), linear-gradient(rgba(255, 255, 255, 0.10), rgba(255, 255, 255, 0.10)), linear-gradient(to bottom, hsla(0, 0%, 100%, 0) 0%, #ffffff 100%), linear-gradient(to right, #00c4cc, #6f00ff)",
                }}
            >
                <Image src={headerBg} alt="Header BG" width={1024} height={300} />
            </div>
            <h1
                className="text-[40px] text-center mt-5 font-medium leading-normal tracking-tighter drop-shadow-2xl bg-clip-text text-transparent"
                style={{
                    backgroundImage:
                        "linear-gradient(90deg,rgba(0, 196, 204, 1) 0%, rgba(90, 50, 250, 1) 50%)",
                }}
            >
                What will you design today?
            </h1>
        </>
    )
}

export default Heading
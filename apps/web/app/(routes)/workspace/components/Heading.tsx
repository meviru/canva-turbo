import Image from "next/image";
import headerBg from "public/header-bg.webp";

const Heading = () => {
    return (
        <>
            <>
                {/* Light mode background */}
                <div
                    className="absolute inset-0 -z-10 rounded-2xl rounded-bl-none rounded-br-none max-h-60 dark:hidden"
                    style={{
                        background: `radial-gradient(ellipse 72% 150% at 50% 100%, #ffffff, hsla(0, 0%, 100%, 0)), 
                        linear-gradient(to bottom, hsla(0, 0%, 100%, 0) 0%, hsla(0, 0%, 100%, 0) 9.5%, #ffffff 94%), 
                        linear-gradient(rgba(255, 255, 255, 0.35), rgba(255, 255, 255, 0.35)), 
                        linear-gradient(rgba(255, 255, 255, 0.10), rgba(255, 255, 255, 0.10)), 
                        linear-gradient(to bottom, hsla(0, 0%, 100%, 0) 0%, #ffffff 100%), 
                        linear-gradient(to right, #00c4cc, #6f00ff)`,
                    }}
                >
                    <Image
                        src={headerBg}
                        alt="Header BG"
                        width={1024}
                        height={300}
                        priority={true}
                        className="mix-blend-overlay"
                        style={{ height: "auto", width: "auto" }}
                    />
                </div>

                {/* Dark mode background */}
                <div
                    className="absolute inset-0 -z-10 rounded-2xl rounded-bl-none rounded-br-none max-h-60 hidden dark:block"
                    style={{
                        background: `radial-gradient(ellipse 72% 150% at 50% 100%, #18191b, rgba(24,25,27,0)),
                            linear-gradient(to bottom, rgba(24,25,27,0) 0%, rgba(24,25,27,0) 9.5%, #18191b 94%),
                            linear-gradient(rgba(24,25,27,0.4), rgba(24,25,27,0.4)),
                            linear-gradient(to bottom, rgba(24,25,27,0) 0%, #18191b 100%),
                            linear-gradient(to right, #00c4cc 0%, #6f00ff 100%)`,
                    }}>
                    <Image
                        src={headerBg}
                        alt="Header BG"
                        width={1024}
                        height={300}
                        priority={true}
                        className="mix-blend-soft-light opacity-80"
                        style={{ height: "auto", width: "auto" }}
                    />
                </div>
            </>
            <h1
                className="text-[40px] text-center mt-5 font-medium leading-normal tracking-tighter drop-shadow-2xl bg-clip-text text-transparent"
                style={{
                    filter: "drop-shadow(0 0 4px var(#18191b))",
                    backgroundImage:
                        "linear-gradient(to bottom right in srgb,#10e2ea 30%,#8b3dff)",
                }}
            >
                What will you design today?
            </h1>
        </>
    );
};

export default Heading
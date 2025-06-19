import { StackHandler } from "@stackframe/stack";
import { stackServerApp } from "../../../stack";
import logo from "public/Canva_Logo.svg";
import authBg from "public/authentication-bg.webp";
import Image from "next/image";

export default function Handler(props: unknown) {
  return (
    <div className="h-screen grid place-items-center w-full relative z-10 bg-cover bg-no-repeat" style={{ backgroundImage: `url(${authBg.src})` }}>
      <Image src={logo.src} width={80} height={30} alt="Canva" className="absolute top-6 left-6 brightness-0 invert-100" />
      <div className="absolute inset-0 bg-black opacity-50 -z-10"></div>
      <div className="absolute top-0 left-0 right-0 h-[250px] bg-linear-to-b from-black/90 to-transparent -z-10"></div>
      <div className="absolute bottom-0 left-0 right-0 h-[250px] bg-linear-to-t from-black/90 to-transparent -z-10"></div>
      <div className="bg-background dark:bg-zinc-900 dark:text-white/90 p-6 pb-7 w-[400px] mx-auto flex items-center justify-center rounded-lg">
        <StackHandler fullPage={false} app={stackServerApp} routeProps={props} />
      </div>
    </div>
  )
}

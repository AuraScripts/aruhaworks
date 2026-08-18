"use client";

import Image from "next/image";

export default function FloatingLogos() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      {/* large left */}
      <div className="absolute -left-16 top-[18%] opacity-[0.07] animate-float-slow md:left-4 md:opacity-[0.09]">
        <Image
          src="/aw-logo-3d.png"
          alt=""
          width={280}
          height={280}
          className="select-none"
          priority={false}
        />
      </div>
      {/* mid right */}
      <div className="absolute -right-10 top-[42%] opacity-[0.06] animate-float-slower md:right-8 md:opacity-[0.08]">
        <Image
          src="/aw-logo-3d.png"
          alt=""
          width={200}
          height={200}
          className="select-none scale-x-[-1]"
          priority={false}
        />
      </div>
      {/* bottom left small */}
      <div className="absolute bottom-[12%] left-[8%] hidden opacity-[0.05] animate-float-slow lg:block">
        <Image
          src="/aw-logo-3d.png"
          alt=""
          width={140}
          height={140}
          className="select-none"
          priority={false}
        />
      </div>
    </div>
  );
}

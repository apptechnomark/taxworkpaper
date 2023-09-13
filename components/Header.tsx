import Image from "next/image";
import React from "react";

export default function Header() {
  return (
    <div className="header bg-[#1492c8] p-5">
      <Image src="/logo.svg" width={150} height={150} alt="Logo" />
    </div>
  );
}

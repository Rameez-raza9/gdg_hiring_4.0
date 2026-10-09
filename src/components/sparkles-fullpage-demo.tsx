"use client";
import React from "react";
import { SparklesCore } from "@/components/ui/sparkles";
import HiringApplicationModal from "@/components/HiringApplicationModal";

export default function SparklesPreview() {
  return (
    <div className="h-[40rem] relative w-full bg-black flex flex-col items-center justify-center overflow-hidden rounded-md">
      <div className="w-full absolute inset-0 h-screen">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>
      <div className="relative z-20 flex flex-col items-center gap-6">
        <h1 className="md:text-7xl text-3xl lg:text-6xl font-bold text-center text-white">
          Build great products
        </h1>
        <HiringApplicationModal />
      </div>
    </div>
  );
}

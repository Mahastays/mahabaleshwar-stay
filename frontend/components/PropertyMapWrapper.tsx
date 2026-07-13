"use client";

import dynamic from "next/dynamic";
import { type ComponentProps } from "react";

// The underlying map component
import type PropertyMapType from "./PropertyMap";

const PropertyMap = dynamic(() => import("@/components/PropertyMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full rounded-2xl bg-gray-100 flex items-center justify-center border border-gray-200 text-gray-500 font-medium">
      Loading Interactive Map...
    </div>
  ),
});

export default function PropertyMapWrapper(props: ComponentProps<typeof PropertyMapType>) {
  return <PropertyMap {...props} />;
}

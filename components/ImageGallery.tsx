"use client";

import { useState } from "react";
import Image from "next/image";
import ImageModal from "@/components/ImageModal";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { getProductImageAlt } from "@/lib/productDisplay";

interface ImageGalleryProps {
  images: string[];
  productName: string;
  category?: string;
}

export default function ImageGallery({ images, productName, category }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const getAltText = (index: number) => {
    const base = getProductImageAlt(productName, category);
    return images.length > 1 ? `${base} — photo ${index + 1}` : base;
  };

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-brand-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-brand-gray-400">No image available</p>
      </div>
    );
  }

  const handleImageClick = () => {
    setIsImageModalOpen(true);
  };

  return (
    <>
      <div className="space-y-4">
        <div
          className="relative aspect-square overflow-hidden rounded-lg bg-brand-gray-100 cursor-pointer group"
          onClick={handleImageClick}
        >
          <Image
            src={images[selectedIndex]}
            alt={getAltText(selectedIndex)}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
            quality={80}
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white bg-opacity-80 rounded-full p-2">
              <MagnifyingGlassIcon className="w-6 h-6 text-brand-gray-900" />
            </div>
          </div>
        </div>

        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {images.map((image, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                  selectedIndex === index
                    ? "border-brand-green"
                    : "border-transparent hover:border-brand-gray-300"
                }`}
              >
                <Image
                  src={image}
                  alt={getAltText(index)}
                  fill
                  className="object-cover"
                  sizes="80px"
                  loading="lazy"
                  quality={65}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <ImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        imageUrl={images[selectedIndex]}
        alt={getAltText(selectedIndex)}
      />
    </>
  );
}

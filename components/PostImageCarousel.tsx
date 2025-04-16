"use client";

import { Navigation, Pagination, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import avatar from "@/public/avatar.jpg";
import Image from "next/image";

interface CarouselProps {
  images: string[];
  pageNos?: boolean;
}

export default function Carousel({ images = [],  pageNos = false }: CarouselProps) {
  
  if (!Array.isArray(images) || images.length === 0) return null;
  return (
    <div className="w-full max-w-5xl mx-auto">
      <Swiper
        // Install Swiper modules
        modules={[Navigation, Pagination, A11y]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={pageNos ? {type: "fraction"} : {clickable: true}}
        scrollbar={{ draggable: true }}
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-64 md:h-96">
              <Image
                src={image}
                alt=""
                layout="fill"
                objectFit="contain"
                className="rounded-lg"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <style jsx global>{`
        .swiper-pagination-fraction {
          color: black;
          font-weight: medium;
        }
        .swiper-pagination-current {
          color: black;
        }
        .swiper-pagination-total {
          color: black;
        }
      `}</style>
    </div>
  );
}

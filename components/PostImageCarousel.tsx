"use client";

import { Navigation, Pagination, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import avatar from "@/public/avatar.jpg";
import Image from "next/image";

export default function Carousel({images}) {
  return (
    <div className="w-full max-w-5xl mx-auto"> 
      <Swiper
        // Install Swiper modules
        modules={[Navigation, Pagination, A11y]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
        onSwiper={(swiper) => console.log(swiper)}
        onSlideChange={() => console.log("slide change")}
      >
        <SwiperSlide>
          <div className="relative w-full h-64 md:h-96">
            <Image
              src={avatar}
              alt="Test image 1"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="relative w-full h-64 md:h-96">
            <Image
              src={avatar}
              alt="Test image 2"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="relative w-full h-64 md:h-96">
            <Image
              src={avatar}
              alt="Test image 3"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="relative w-full h-64 md:h-96">
            <Image
              src={avatar}
              alt="Test image 4"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="relative w-full h-64 md:h-96">
            <Image
              src={avatar}
              alt="Test image 5"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}

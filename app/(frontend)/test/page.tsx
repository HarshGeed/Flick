"use client";

import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import avatar from "@/public/avatar.jpg";
import Image from "next/image";

export default function Test() {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <Swiper
        // Install Swiper modules
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
        onSwiper={(swiper) => console.log(swiper)}
        onSlideChange={() => console.log("slide change")}
      >
        <SwiperSlide>
          <Image
            src={avatar}
            alt="Test image 1"
            width={300}
            height={300}
            className="rounded-lg"
          />
        </SwiperSlide>
        <SwiperSlide>
          <Image
            src={avatar}
            alt="Test image 2"
            width={300}
            height={300}
            className="rounded-lg"
          />
        </SwiperSlide>
        <SwiperSlide>
          <Image
            src={avatar}
            alt="Test image 3"
            width={300}
            height={300}
            className="rounded-lg"
          />
        </SwiperSlide>
        <SwiperSlide>
          <Image
            src={avatar}
            alt="Test image 4"
            width={300}
            height={300}
            className="rounded-lg"
          />
        </SwiperSlide>
      </Swiper>
      <p>
        
      </p>
    </div>
  );
}

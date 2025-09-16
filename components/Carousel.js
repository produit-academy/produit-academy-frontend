"use client";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

export default function Carousel({ children }) {
  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      loop={true}
      autoplay={{
        delay: 1000,
        disableOnInteraction: true,
      }}
      slidesPerView={1}
      spaceBetween={30} 
      pagination={{
        clickable: true, 
      }}
      breakpoints={{
        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },
      }}
      className="mySwiper" 
    >
      {children}
    </Swiper>
  );
}
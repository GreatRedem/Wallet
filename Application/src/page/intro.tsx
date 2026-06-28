import type { Swiper as SwiperType } from 'swiper';

import { FiGlobe } from 'react-icons/fi';
import { LuImport } from 'react-icons/lu';
import { useRef, useCallback } from 'react';
import { FaPlusCircle } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { IoIosArrowDown, IoIosArrowForward } from 'react-icons/io';

import { T } from '../utility/language';

import IntroConnect from '../assets/image/intro_connect.png';
import IntroDecentralized from '../assets/image/intro_decentralized.png';

import 'swiper/css';
import 'swiper/css/pagination';

const slideMap =
[
    {
        image: IntroConnect,
        header: 'Intro.Slides.Connect.Header',
        message: 'Intro.Slides.Connect.Message'
    },
    {
        image: IntroDecentralized,
        header: 'Intro.Slides.Decentralized.Header',
        message: 'Intro.Slides.Decentralized.Message'
    },
    {
        image: IntroConnect,
        header: 'Intro.Slides.Secure.Header',
        message: 'Intro.Slides.Secure.Message'
    }
];

export default function IntroPage()
{
    const swiperRef = useRef<SwiperType>(undefined);

    const onSwiper = useCallback((swiper: SwiperType) =>
    {
        swiperRef.current = swiper;
    }, []);

    return (
        <div className='flex size-full flex-col bg-base-1 px-4'>

            <button className='btn-normal mt-4 flex h-10 w-fit items-center gap-2 rounded-lg p-2 text-txt-normal outline-0'>

                <FiGlobe size={ 16 } />

                <span className='text-small'>

                    { T('Intro.Language') }

                </span>

                <IoIosArrowDown size={ 16 } />

            </button>

            <Swiper
                modules={ [ Autoplay, Pagination ] }
                onSwiper={ onSwiper }
                loop={ true }
                autoplay={ { disableOnInteraction: false, pauseOnMouseEnter: true } }
                pagination={ { clickable: true, renderBullet: (i, className) => `<button class="${ className }"></button>` } }
                className='size-full'>

                {
                    slideMap.map((slide) => (
                        <SwiperSlide key={ slide.header }>

                            <div className='flex h-full flex-col items-center'>

                                <img
                                    src={ slide.image }
                                    className='size-60'
                                    draggable={ false } />

                                <h1 className='text-large font-bold text-txt-normal'>

                                    { T(slide.header) }

                                </h1>

                                <p className='text-center text-small text-txt-normal/75'>

                                    { T(slide.message) }

                                </p>

                            </div>

                        </SwiperSlide>
                    ))
                }

            </Swiper>

            <div className='flex flex-col gap-2'>

                <button className='btn-primary flex h-12 items-center gap-2 rounded-lg p-2 outline-0'>

                    <FaPlusCircle size={ 32 } className='p-1.5' />

                    <span className='flex-1 text-start'>

                        { T('Intro.Actions.Create') }

                    </span>

                    <IoIosArrowForward size={ 16 } />

                </button>

                <button className='btn-secondary flex h-12 items-center gap-2 rounded-lg p-2 outline-0'>

                    <LuImport size={ 32 } className='p-1.5' />

                    <span className='flex-1 text-start'>

                        { T('Intro.Actions.Import') }

                    </span>

                    <IoIosArrowForward size={ 16 } />

                </button>

                <span className='text-center text-tiny text-txt-muted'>

                    { T('Intro.Version') }

                </span>

            </div>

        </div>
    );
}

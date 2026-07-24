import type { IconType } from 'react-icons';
import type { Swiper as SwiperType } from 'swiper';

import { motion } from 'motion/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { HiOutlineArrowsRightLeft, HiOutlineCog6Tooth, HiOutlineWallet } from 'react-icons/hi2';

import WalletManager from '../core/wallet';

import { getDirection, getLanguage, T } from '../utility/language';

import 'swiper/css';

const navMap: { key: string; icon: IconType } [ ] =
[
    { key: 'Wallet', icon: HiOutlineWallet },
    { key: 'Activity', icon: HiOutlineArrowsRightLeft },
    { key: 'Settings', icon: HiOutlineCog6Tooth }
];

export default function DashboardPage({ mnemonic }: { mnemonic: string })
{
    const swiperRef = useRef<SwiperType>(undefined);

    const [ active, setActive ] = useState(0);

    const onSwiper = useCallback((swiper: SwiperType) =>
    {
        swiperRef.current = swiper;
    }, [ ]);

    const onSlideChange = useCallback((swiper: SwiperType) =>
    {
        setActive(swiper.activeIndex);
    }, [ ]);

    const onSelect = useCallback((index: number) =>
    {
        swiperRef.current?.slideTo(index);
    }, [ ]);

    return (
        <motion.div
            initial={ { opacity: 0 } }
            animate={ { opacity: 1 } }
            transition={ { type: 'tween' } }
            className='relative size-full bg-base-1'>

            <Swiper
                key={ getLanguage().code }
                dir={ getDirection() }
                speed={ 350 }
                onSwiper={ onSwiper }
                onSlideChange={ onSlideChange }
                className='size-full'>

                <SwiperSlide>

                    <div className='flex size-full flex-col gap-2 overflow-y-auto p-4 pb-28'>

                        <div className='text-large font-semibold text-txt-normal'>

                            { T('Dashboard.Title') }

                        </div>

                        <div className='text-tiny text-txt-muted'>

                            { T('Dashboard.Address') }

                        </div>

                        <div className='glass-panel rounded-xl p-3 text-tiny break-all text-txt-normal'>

                            0x00001234000123400001111

                        </div>

                    </div>

                </SwiperSlide>

                <SwiperSlide>

                    <div className='flex size-full flex-col gap-2 overflow-y-auto p-4 pb-28'>

                        <div className='text-large font-semibold text-txt-normal'>

                            { T('Dashboard.Nav.Activity') }

                        </div>

                        <div className='text-tiny text-txt-muted'>

                            { T('Dashboard.Empty') }

                        </div>

                    </div>

                </SwiperSlide>

                <SwiperSlide>

                    <div className='flex size-full flex-col gap-2 overflow-y-auto p-4 pb-28'>

                        <div className='text-large font-semibold text-txt-normal'>

                            { T('Dashboard.Nav.Settings') }

                        </div>

                        <div className='text-tiny text-txt-muted'>

                            { T('Dashboard.Empty') }

                        </div>

                    </div>

                </SwiperSlide>

            </Swiper>

            <div className='glass-panel absolute inset-x-0 bottom-4 z-20 mx-auto flex w-fit gap-1 rounded-full p-1'>

                {
                    navMap.map((item, index) =>
                    {
                        const isActive = index === active;

                        return (
                            <button
                                type='button'
                                key={ item.key }
                                onClick={ () => { onSelect(index); } }
                                className={ `group relative flex h-12 w-20 cursor-pointer items-center justify-center rounded-full duration-300 ${ isActive ? '' : 'hover:bg-btn-muted-hover' }` }>

                                {
                                    isActive &&
                                    (
                                        <motion.div
                                            layoutId='dashboard-nav-active'
                                            transition={ { type: 'spring', stiffness: 420, damping: 35 } }
                                            className='absolute inset-0 rounded-full bg-btn-primary' />
                                    )
                                }

                                <div className={ `relative flex flex-col items-center gap-1 duration-300 ${ isActive ? 'text-txt-reverse' : 'text-txt-muted group-hover:text-txt-normal' }` }>

                                    <item.icon size={ 16 } />

                                    <div className='text-tiny'>

                                        { T(`Dashboard.Nav.${ item.key }`) }

                                    </div>

                                </div>

                            </button>
                        );
                    })
                }

            </div>

        </motion.div>
    );
}

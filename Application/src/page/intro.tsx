import { useState } from 'react';
import { FiArrowLeft, FiArrowRight, FiCreditCard, FiGlobe, FiPlus } from 'react-icons/fi';
import { TbFingerprint } from 'react-icons/tb';

import { Background } from '../components/background';

import { getLanguage, T } from '../utility/language';

import Image1 from '../assets/image/splash-slide-1.png';
import Image2 from '../assets/image/splash-slide-2.png';
import Image3 from '../assets/image/splash-slide-3.png';

export default function IntroPage()
{
    return (
        <Background type='primary' className='flex size-full flex-col p-2.5'>

            <div className='flex h-10 items-center gap-2 bg-amber-400!'>

                <div className='size-10 bg-amber-300 p-1'>

                    <img src={ Image1 } className='size-full' />

                </div>

                <div className='text-lg font-bold text-white'>GWallet</div>

                <div className='flex-1' />

                <div>

                    English

                </div>

            </div>

        </Background>
    );
}

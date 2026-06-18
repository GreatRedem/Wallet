import { useState } from 'react';
import { FiArrowLeft, FiArrowRight, FiCreditCard, FiGlobe, FiPlus } from 'react-icons/fi';
import { TbFingerprint } from 'react-icons/tb';

import { ButtonIcon } from '../components/button';
import { Background } from '../components/background';

import { getLanguage, T } from '../utility/language';

import Logo from '../assets/image/logo.png';

export default function IntroPage()
{
    return (
        <Background type='primary' className='flex size-full flex-col p-2.5'>

            <div className='flex h-10 items-center gap-2'>

                <ButtonIcon icon={ Logo } />

                <div className='text-lg font-bold text-white'>GWallet</div>

                <div className='flex-1' />

                <div>

                    English

                </div>

            </div>

        </Background>
    );
}

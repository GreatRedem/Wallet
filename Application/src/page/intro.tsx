import { FiGlobe } from 'react-icons/fi';
import { LuImport } from 'react-icons/lu';
import { useEffect, useState } from 'react';
import { MdOutlineCreateNewFolder } from 'react-icons/md';
import { IoIosArrowDown, IoIosArrowForward } from 'react-icons/io';
import { FaPlusCircle } from 'react-icons/fa';

import { T } from '../utility/language';

import Logo from '../assets/image/logo.png';

const slideMap =
[
    {
        image: Logo,
        headline: 'Connect to the World',
        text: 'Connect to the world of decentralized applications and finance.'
    },
    {
        image: Logo,
        headline: 'Decentralized',
        text: 'Gives you full control over your digital assets and allows you to interact with dApps.'
    },
    {
        image: Logo,
        headline: 'Secure & Private',
        text: 'Using advanced security protocols to protect your digital assets and personal information.'
    }
];

export default function IntroPage()
{
    const [ activeSlide, setActiveSlide ] = useState(0);

    const currentSlide = slideMap[activeSlide];

    useEffect(() =>
    {
        const timer = setInterval(() =>
        {
            setActiveSlide((prev) => (prev + 1) % slideMap.length);
        }, 5000);

        return () =>
        {
            clearInterval(timer);
        };
    }, [ ]);

    return (
        <div className='flex size-full flex-col bg-base-300 p-4 text-(--text-normal)'>

            <button className='btn-glass flex h-10 w-fit cursor-pointer items-center gap-2 rounded-lg p-2'>

                <FiGlobe size={ 16 } />

                <span className='text-small'>

                    {
                        T('Language.English')
                    }

                </span>

                <IoIosArrowDown size={ 16 } />

            </button>

            <div className='flex flex-1 flex-col items-center py-4'>

                <img
                    src={ currentSlide.image }
                    alt={ currentSlide.headline }
                    className='size-60' />

                <div className='flex gap-2.5 py-4'>

                    {
                        slideMap.map((slide, index) => (

                            <button
                                key={ slide.headline }
                                onClick={ () => { setActiveSlide(index); } }
                                className={ `size-2.5 rounded-sm bg-secondary/50 outline-offset-2 duration-200 hover:bg-primary focus:outline-2 ${ activeSlide === index ? 'bg-primary! outline-primary' : 'cursor-pointer outline-base-100/50' }` } />

                        ))
                    }

                </div>

                <h1 className='text-center text-large font-semibold'>

                    {
                        currentSlide.headline
                    }

                </h1>

                <p className='text-center text-small'>

                    {
                        currentSlide.text
                    }

                </p>

            </div>

            <div className='flex flex-col gap-2'>

                <button className='btn-primary flex h-12 cursor-pointer items-center gap-2 rounded-lg p-2 outline-0 outline-transparent'>

                    <FaPlusCircle size={ 24 } className='p-1' />

                    <span className='flex-1 text-start'>Create New Wallet</span>

                    <IoIosArrowForward size={ 16 } />

                </button>

                <button className='btn-secondary flex h-12 cursor-pointer items-center gap-2 rounded-lg p-2 outline-0 outline-transparent'>

                    <LuImport size={ 32 } className='p-1.5' />

                    <span className='flex-1 text-start'>Import Existing Wallet</span>

                    <IoIosArrowForward size={ 16 } />

                </button>

                <span className='text-center text-tiny text-(--text-muted)'>

                    Version 1.0.0

                </span>

            </div>

        </div>
    );
}

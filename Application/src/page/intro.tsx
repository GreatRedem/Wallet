import { FiGlobe } from 'react-icons/fi';
import { LuImport } from 'react-icons/lu';
import { useEffect, useState } from 'react';
import { FaPlusCircle } from 'react-icons/fa';
import { IoIosArrowDown, IoIosArrowForward } from 'react-icons/io';

import { T } from '../utility/language';

import Logo from '../assets/image/logo.png';

const slideMap =
[
    {
        image: Logo,
        header: 'Connect to the World',
        message: 'Connect to the world of decentralized applications and finance.'
    },
    {
        image: Logo,
        header: 'Decentralized',
        message: 'Gives you full control over your digital assets and allows you to interact with dApps.'
    },
    {
        image: Logo,
        header: 'Secure & Private',
        message: 'Using advanced security protocols to protect your digital assets and personal information.'
    }
];

export default function IntroPage()
{
    const [ activeSlide, setActiveSlide ] = useState(0);

    const slide = slideMap[activeSlide];

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
        <div className='flex size-full flex-col bg-base-1 px-4'>

            <button className='btn-normal mt-4 flex h-10 w-fit items-center gap-2 rounded-lg p-2 text-txt-normal outline-0'>

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
                    src={ slide.image }
                    className='size-60' />

                <div className='flex gap-2.5 py-4'>

                    {
                        slideMap.map((s, i) => (

                            <button
                                key={ s.header }
                                onClick={ () => { setActiveSlide(i); } }
                                className={ `btn-normal size-2.5 rounded-sm outline-0 ${ activeSlide === i ? 'cursor-default! bg-btn-primary! focus:outline-btn-primary!' : 'bg-btn-primary/25! focus:outline-btn-primary/25!' }` } />

                        ))
                    }

                </div>

                <h1 className='text-center text-large font-bold text-txt-normal'>

                    {
                        slide.header
                    }

                </h1>

                <p className='text-center text-small text-txt-normal/75'>

                    {
                        slide.message
                    }

                </p>

            </div>

            <div className='flex flex-col gap-2'>

                <button className='btn-primary flex h-12 items-center gap-2 rounded-lg p-2 outline-0'>

                    <FaPlusCircle size={ 32 } className='p-1.5' />

                    <span className='flex-1 text-start'>Create New Wallet</span>

                    <IoIosArrowForward size={ 16 } />

                </button>

                <button className='btn-secondary flex h-12 items-center gap-2 rounded-lg p-2 outline-0'>

                    <LuImport size={ 32 } className='p-1.5' />

                    <span className='flex-1 text-start'>Import Existing Wallet</span>

                    <IoIosArrowForward size={ 16 } />

                </button>

                <span className='text-center text-tiny text-txt-muted'>

                    Version 1.0.0

                </span>

            </div>

        </div>
    );
}

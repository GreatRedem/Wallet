import { FiGlobe } from 'react-icons/fi';
import { LuImport } from 'react-icons/lu';
import { useEffect, useState } from 'react';
import { FaPlusCircle } from 'react-icons/fa';
import { IoIosArrowDown, IoIosArrowForward } from 'react-icons/io';

import { T } from '../utility/language';

import IntroConnect from '../assets/image/intro_connect.png';
import IntroDecentralized from '../assets/image/intro_decentralized.png';

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
                        T('Intro.Language')
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
                        T(slide.header)
                    }

                </h1>

                <p className='text-center text-small text-txt-normal/75'>

                    {
                        T(slide.message)
                    }

                </p>

            </div>

            <div className='flex flex-col gap-2'>

                <button className='btn-primary flex h-12 items-center gap-2 rounded-lg p-2 outline-0'>

                    <FaPlusCircle size={ 32 } className='p-1.5' />

                    <span className='flex-1 text-start'>{ T('Intro.Actions.Create') }</span>

                    <IoIosArrowForward size={ 16 } />

                </button>

                <button className='btn-secondary flex h-12 items-center gap-2 rounded-lg p-2 outline-0'>

                    <LuImport size={ 32 } className='p-1.5' />

                    <span className='flex-1 text-start'>{ T('Intro.Actions.Import') }</span>

                    <IoIosArrowForward size={ 16 } />

                </button>

                <span className='text-center text-tiny text-txt-muted'>

                    {
                        T('Intro.Version')
                    }

                </span>

            </div>

        </div>
    );
}

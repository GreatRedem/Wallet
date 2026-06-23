import { FiGlobe } from 'react-icons/fi';
import { LuImport } from 'react-icons/lu';
import { CiSquarePlus } from 'react-icons/ci';
import { MdOutlineCreateNewFolder } from 'react-icons/md';
import { IoIosArrowDown, IoIosArrowForward } from 'react-icons/io';

import { T } from '../utility/language';

import Logo from '../assets/image/logo.png';

export default function IntroPage()
{
    return (
        <div className='flex size-full flex-col bg-(--bg-normal) p-4'>

            <button className='flex h-10 w-fit cursor-pointer items-center gap-2 rounded-lg border border-(--b-normal) p-2 text-(--text-normal) outline-offset-2 outline-(--o-normal) hover:border-(--b-hover) hover:bg-(--bg-hover) focus:outline-2 active:border-(--b-active) active:bg-(--bg-active)'>

                <FiGlobe size={ 16 } />

                <span className='text-small'>

                    {
                        T('Language.English')
                    }

                </span>

                <IoIosArrowDown size={ 16 } />

            </button>

            <div className='flex-1'>
                Slider Show Goes Here
            </div>

            <div className='flex flex-col gap-2 text-(--text-normal)'>

                <button className='flex h-12 cursor-pointer items-center gap-2 rounded-lg border border-(--b-normal) bg-(--primary-normal) p-2 outline-offset-2 outline-(--o-primary) hover:border-(--b-hover) hover:bg-(--bg-hover) focus:outline-2 active:border-(--b-active) active:bg-(--bg-active)'>

                    <MdOutlineCreateNewFolder size={ 32 } className='p-1' />

                    <span className='flex-1 text-start'>Create New Wallet</span>

                    <IoIosArrowForward size={ 16 } />

                </button>

                <button className='flex h-12 cursor-pointer items-center gap-2 rounded-lg border border-(--b-normal) p-2 outline-offset-2 outline-(--o-normal) hover:border-(--b-hover) hover:bg-(--bg-hover) focus:outline-2 active:border-(--b-active) active:bg-(--bg-active)'>

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

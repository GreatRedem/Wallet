import { useState } from 'react';
import { motion } from 'motion/react';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

import IntroPage from '../page/intro';

import { T } from '../utility/language';
import { openPage } from '../utility/context';

export default function IntroWallet()
{
    const [ name, setName ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ confirm, setConfirm ] = useState('');
    const [ showPwd, setShowPwd ] = useState(false);
    const [ showConf, setShowConf ] = useState(false);
    const [ agreed, setAgreed ] = useState(false);

    return (
        <motion.div
            initial={ { scaleX: 0 } }
            animate={ { scaleX: 1 } }
            exit={ { scaleX: 0 } }
            className='flex size-full flex-col bg-base-1 px-4'>

            <button
                onClick={ () => { openPage(IntroPage); } }
                className='btn-normal mt-4 flex size-10 items-center justify-center rounded-lg outline-0'>

                <IoIosArrowBack size={ 20 } />

            </button>

            <div className='mt-2 mb-7 flex flex-col items-center'>

                <h1 className='text-large font-bold text-txt-normal'>

                    { T('CreateWallet.Title') }

                </h1>

                <p className='text-small text-txt-normal/50'>

                    { T('CreateWallet.Subtitle') }

                </p>

            </div>

            <div className='flex flex-col gap-4'>

                <label className='flex flex-col gap-2'>

                    <span className='text-tiny font-medium text-txt-normal/60'>

                        { T('CreateWallet.Name') }

                    </span>

                    <input
                        value={ name }
                        onChange={ (e) => { setName(e.target.value); } }
                        placeholder='My Main Wallet'
                        className='input-normal h-12 rounded-lg px-3 text-small outline-0' />

                </label>

                <label className='flex flex-col gap-2'>

                    <span className='text-tiny font-medium text-txt-normal/60'>

                        { T('CreateWallet.Password') }

                    </span>

                    <div className='relative flex items-center'>

                        <input
                            type={ showPwd ? 'text' : 'password' }
                            value={ password }
                            onChange={ (e) => { setPassword(e.target.value); } }
                            className='input-normal h-12 w-full rounded-lg px-3 pr-10 text-small outline-0' />
                        <button
                            onClick={ () => { setShowPwd(!showPwd); } }
                            className='absolute right-3 text-txt-normal/40 outline-0'>
                            { showPwd ? <HiEyeOff size={ 18 } /> : <HiEye size={ 18 } /> }
                        </button>
                    </div>
                </label>

                <label className='flex flex-col gap-2'>
                    <span className='text-tiny font-medium text-txt-normal/60'>
                        { T('CreateWallet.Confirm') }
                    </span>
                    <div className='relative flex items-center'>
                        <input
                            type={ showConf ? 'text' : 'password' }
                            value={ confirm }
                            onChange={ (e) => { setConfirm(e.target.value); } }
                            className='input-normal h-12 w-full rounded-lg px-3 pr-10 text-small outline-0' />
                        <button
                            onClick={ () => { setShowConf(!showConf); } }
                            className='absolute right-3 text-txt-normal/40 outline-0'>
                            { showConf ? <HiEyeOff size={ 18 } /> : <HiEye size={ 18 } /> }
                        </button>
                    </div>
                </label>

            </div>

            <button
                onClick={ () => { setAgreed(!agreed); } }
                className='mt-5 flex items-start gap-3 text-start outline-0'>
                <div className={
                    `mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-sm
                    ${ agreed ? 'bg-primary' : 'border border-txt-normal/25 bg-transparent' }`
                }>
                    { agreed && <IoIosArrowForward size={ 12 } className='rotate-45 text-white' /> }
                </div>
                <span className='text-tiny/relaxed text-txt-normal/60'>
                    { T('CreateWallet.Agreement') }
                </span>
            </button>

            <div className='mt-auto pt-6'>
                <button
                    className='btn-primary flex h-12 w-full items-center justify-center rounded-lg text-small font-semibold outline-0 disabled:opacity-30'>
                    { T('CreateWallet.Submit') }
                </button>
            </div>

        </motion.div>
    );
}

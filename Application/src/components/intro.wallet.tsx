import { useState } from 'react';
import { motion } from 'motion/react';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

import { T } from '../utility/language';

interface IntroWalletProps
{
    onClose: () => void;
}

export default function IntroWallet({ onClose }: IntroWalletProps)
{
    const [ name, setName ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ confirm, setConfirm ] = useState('');
    const [ showPwd, setShowPwd ] = useState(false);
    const [ showConf, setShowConf ] = useState(false);
    const [ agreed, setAgreed ] = useState(false);

    return (
        <>
            {/* Backdrop overlay */}
            <motion.div
                initial={ { opacity: 0 } }
                animate={ { opacity: 1 } }
                exit={ { opacity: 0 } }
                transition={ { duration: 0.3 } }
                className='absolute inset-0 z-10 size-full bg-black/20'
                style={ {
                    backdropFilter: 'blur(2px)',
                    WebkitBackdropFilter: 'blur(2px)'
                } }
                onClick={ onClose }
            />

            {/* Main content panel */}
            <motion.div
                initial={ { y: '-100%' } }
                animate={ { y: '0%' } }
                exit={ { y: '-100%' } }
                transition={ { duration: 0.4, ease: 'easeInOut' } }
                className='absolute left-0 right-0 top-0 z-20 mx-auto max-w-md rounded-b-3xl px-4 pb-6 pt-4'
                style={ {
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                    maxHeight: '85vh',
                    overflowY: 'auto'
                } }
                onClick={ (e) => e.stopPropagation() }>

                <button
                    onClick={ onClose }
                    className='btn-normal flex size-10 items-center justify-center rounded-lg outline-0'
                    style={ {
                        background: 'rgba(255, 255, 255, 0.5)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)'
                    } }>

                    <IoIosArrowBack size={ 20 } />

                </button>

                <div className='mt-2 mb-7 flex flex-col items-center'>

                    <h1 className='text-large font-bold text-txt-normal'
                        style={ {
                            textShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                        }}>

                        { T('CreateWallet.Title') }

                    </h1>

                    <p className='text-small text-txt-normal/50'
                       style={ {
                           textShadow: '0 1px 5px rgba(0, 0, 0, 0.05)'
                       }}>

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
                            className='h-12 rounded-lg px-3 text-small outline-0'
                            style={ {
                                background: 'rgba(255, 255, 255, 0.6)',
                                backdropFilter: 'blur(10px)',
                                WebkitBackdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.4)',
                                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                                transition: 'all 0.3s ease'
                            } }
                            onFocus={ (e) => {
                                e.target.style.background = 'rgba(255, 255, 255, 0.8)';
                                e.target.style.borderColor = 'rgba(255, 255, 255, 0.6)';
                                e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
                            } }
                            onBlur={ (e) => {
                                e.target.style.background = 'rgba(255, 255, 255, 0.6)';
                                e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                                e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.05)';
                            } } />

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
                                className='h-12 w-full rounded-lg px-3 pr-10 text-small outline-0'
                                style={ {
                                    background: 'rgba(255, 255, 255, 0.6)',
                                    backdropFilter: 'blur(10px)',
                                    WebkitBackdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255, 255, 255, 0.4)',
                                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                                    transition: 'all 0.3s ease'
                                } }
                                onFocus={ (e) => {
                                    e.target.style.background = 'rgba(255, 255, 255, 0.8)';
                                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.6)';
                                    e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
                                } }
                                onBlur={ (e) => {
                                    e.target.style.background = 'rgba(255, 255, 255, 0.6)';
                                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                                    e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.05)';
                                } } />
                            <button
                                onClick={ () => { setShowPwd(!showPwd); } }
                                className='absolute right-3 text-txt-normal/40 outline-0'
                                style={ {
                                    transition: 'all 0.2s ease'
                                } }
                                onMouseEnter={ (e) => {
                                    e.currentTarget.style.color = 'rgba(5, 5, 5, 0.6)';
                                } }
                                onMouseLeave={ (e) => {
                                    e.currentTarget.style.color = 'rgba(5, 5, 5, 0.4)';
                                } }>
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
                                className='h-12 w-full rounded-lg px-3 pr-10 text-small outline-0'
                                style={ {
                                    background: 'rgba(255, 255, 255, 0.6)',
                                    backdropFilter: 'blur(10px)',
                                    WebkitBackdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255, 255, 255, 0.4)',
                                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                                    transition: 'all 0.3s ease'
                                } }
                                onFocus={ (e) => {
                                    e.target.style.background = 'rgba(255, 255, 255, 0.8)';
                                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.6)';
                                    e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
                                } }
                                onBlur={ (e) => {
                                    e.target.style.background = 'rgba(255, 255, 255, 0.6)';
                                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                                    e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.05)';
                                } } />
                            <button
                                onClick={ () => { setShowConf(!showConf); } }
                                className='absolute right-3 text-txt-normal/40 outline-0'
                                style={ {
                                    transition: 'all 0.2s ease'
                                } }
                                onMouseEnter={ (e) => {
                                    e.currentTarget.style.color = 'rgba(5, 5, 5, 0.6)';
                                } }
                                onMouseLeave={ (e) => {
                                    e.currentTarget.style.color = 'rgba(5, 5, 5, 0.4)';
                                } }>
                                { showConf ? <HiEyeOff size={ 18 } /> : <HiEye size={ 18 } /> }
                            </button>
                        </div>
                    </label>

                </div>

                <button
                    onClick={ () => { setAgreed(!agreed); } }
                    className='mt-5 flex items-start gap-3 text-start outline-0'
                    style={ {
                        transition: 'all 0.2s ease'
                    } }>
                    <div className={
                        `mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-sm`
                    }
                    style={ {
                        background: agreed ? 'var(--color-btn-primary)' : 'rgba(255, 255, 255, 0.4)',
                        backdropFilter: agreed ? 'none' : 'blur(10px)',
                        WebkitBackdropFilter: agreed ? 'none' : 'blur(10px)',
                        border: agreed ? '1px solid var(--color-btn-primary-border)' : '1px solid rgba(255, 255, 255, 0.3)',
                        boxShadow: agreed ? '0 4px 15px rgba(85, 130, 220, 0.3)' : '0 4px 15px rgba(0, 0, 0, 0.05)',
                        transition: 'all 0.3s ease'
                    } }>
                        { agreed && <IoIosArrowForward size={ 12 } className='rotate-45 text-white' /> }
                    </div>
                    <span className='text-tiny/relaxed text-txt-normal/60'>
                        { T('CreateWallet.Agreement') }
                    </span>
                </button>

                <div className='mt-6'>
                    <button
                        className='flex h-12 w-full items-center justify-center rounded-lg text-small font-semibold outline-0 disabled:opacity-30'
                        style={ {
                            background: 'linear-gradient(135deg, var(--color-btn-primary) 0%, rgba(85, 130, 220, 0.8) 100%)',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            boxShadow: '0 8px 25px rgba(85, 130, 220, 0.4)',
                            color: 'var(--color-txt-reverse)',
                            transition: 'all 0.3s ease'
                        } }
                        onMouseEnter={ (e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 12px 35px rgba(85, 130, 220, 0.5)';
                        } }
                        onMouseLeave={ (e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(85, 130, 220, 0.4)';
                        } }
                        onMouseDown={ (e) => {
                            e.currentTarget.style.transform = 'translateY(0) scale(0.98)';
                        } }
                        onMouseUp={ (e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        } }>
                        { T('CreateWallet.Submit') }
                    </button>
                </div>

            </motion.div>
        </>
    );
}
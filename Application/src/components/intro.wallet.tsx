import { useState } from 'react';
import { motion } from 'motion/react';
import { FiCheck, FiCopy } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';
import { IoIosArrowForward } from 'react-icons/io';
import { HiEye, HiEyeOff, HiOutlineLockClosed } from 'react-icons/hi';

import wallet from '../core/wallet';

import { getDirection, T } from '../utility/language';

type CreateStep = 'phrase' | 'password';

export default function IntroWallet({ onClose }: { onClose: () => void })
{
    const [ step, setStep ] = useState<CreateStep>('phrase');

    // Recovery phrase state (generated once for the lifetime of this panel)
    const [ phrase ] = useState(() => wallet.Generate() ?? '');
    const [ revealed, setRevealed ] = useState(false);
    const [ copied, setCopied ] = useState(false);
    const [ saved, setSaved ] = useState(false);

    // Password state
    const [ agree, setAgree ] = useState(false);
    const [ password, setPassword ] = useState('');
    const [ password2, setPassword2 ] = useState('');
    const [ showPassword, setShowPassword ] = useState(false);
    const [ showPassword2, setShowPassword2 ] = useState(false);

    const words = phrase.length > 0 ? phrase.split(' ') : [];

    const mismatch = password2.length > 0 && password !== password2;

    const formValid =
    password.length > 0 &&
    password === password2 &&
    agree;

    const flip = getDirection() === 'rtl' ? 'rotate-180' : '';

    const handleCopy = () =>
    {
        void navigator.clipboard.writeText(phrase);

        setCopied(true);

        setTimeout(() =>
        {
            setCopied(false);
        }, 1500);
    };

    const handleCreate = () =>
    {
        if (!formValid)
        {
            return;
        }

        // TODO: persist wallet (phrase) + password, then navigate to the wallet home
        onClose();
    };

    return (
        <>
            <motion.div
                initial={ { opacity: 0 } }
                animate={ { opacity: 1 } }
                exit={ { opacity: 0 } }
                className='absolute inset-0 z-10 size-full cursor-pointer bg-black/25 backdrop-blur-xs'
                onClick={ onClose } />

            <motion.div
                initial={ { y: '-100%' } }
                animate={ { y: '0%' } }
                exit={ { y: '-100%' } }
                transition={ { type: 'tween' } }
                className='glass-panel absolute inset-0 z-20 mx-2 flex h-fit flex-col gap-2 rounded-b-3xl px-4'>

                <div className='mt-4 flex items-center justify-between'>

                    {
                        step === 'password' ?
                            (
                                <button
                                    type='button'
                                    onClick={ () => { setStep('phrase'); } }
                                    className='btn-muted flex h-10 w-fit items-center gap-2 rounded-lg px-3 text-small'>

                                    <IoIosArrowForward size={ 16 } className={ `rotate-180 ${ flip }` } />

                                    {
                                        T('CreateWallet.Back')
                                    }

                                </button>
                            ) :
                            (
                                <div className='size-10' />
                            )
                    }

                    <button
                        type='button'
                        onClick={ onClose }
                        className='btn-muted flex size-10 items-center justify-center rounded-lg'>

                        <IoClose size={ 24 } />

                    </button>

                </div>

                <div className='flex justify-center gap-2'>

                    <div className={ `h-1 w-8 rounded-full duration-300 ${ step === 'phrase' ? 'bg-btn-primary' : 'bg-base-3' }` } />

                    <div className={ `h-1 w-8 rounded-full duration-300 ${ step === 'password' ? 'bg-btn-primary' : 'bg-base-3' }` } />

                </div>

                {
                    step === 'phrase' && (
                        <>
                            <div className='text-center text-large font-bold text-txt-normal'>

                                {
                                    T('CreateWallet.PhraseTitle')
                                }

                            </div>

                            <div className='text-center text-tiny text-txt-muted'>

                                {
                                    T('CreateWallet.PhraseHint')
                                }

                            </div>

                            <div className='relative mt-2'>

                                <div className={ `grid grid-cols-3 gap-2 duration-300 ${ revealed ? '' : 'blur-sm select-none' }` }>

                                    {
                                        words.map((word, index) => (
                                            <div
                                                key={ `${ index }-${ word }` }
                                                className='flex items-center gap-2 rounded-lg bg-base-2 px-3 py-2 text-small'>

                                                <span className='text-tiny text-txt-muted'>

                                                    {
                                                        index + 1
                                                    }

                                                </span>

                                                <span className='text-txt-normal'>

                                                    {
                                                        word
                                                    }

                                                </span>

                                            </div>
                                        ))
                                    }

                                </div>

                                {
                                    !revealed && (
                                        <button
                                            type='button'
                                            onClick={ () => { setRevealed(true); } }
                                            className='btn-muted absolute inset-0 m-auto flex h-10 w-fit items-center gap-2 rounded-lg px-4 text-small'>

                                            <HiEye size={ 18 } />

                                            {
                                                T('CreateWallet.Reveal')
                                            }

                                        </button>
                                    )
                                }

                            </div>

                            <button
                                type='button'
                                onClick={ handleCopy }
                                className='btn-muted mx-auto flex h-9 w-fit items-center gap-2 rounded-lg px-4 text-tiny'>

                                {
                                    copied ? <FiCheck size={ 16 } /> : <FiCopy size={ 16 } />
                                }

                                {
                                    copied ? T('CreateWallet.Copied') : T('CreateWallet.Copy')
                                }

                            </button>

                            <label className='flex h-10 cursor-pointer items-center gap-2'>

                                <button
                                    type='button'
                                    onClick={ () => { setSaved(!saved); } }
                                    className='glass-input flex size-5 items-center justify-center rounded-sm'>

                                    {
                                        saved && <FiCheck size={ 16 } className='text-txt-muted' />
                                    }

                                </button>

                                <div className='text-tiny text-txt-muted'>

                                    {
                                        T('CreateWallet.Saved')
                                    }

                                </div>

                            </label>

                            <button
                                type='button'
                                disabled={ !saved }
                                onClick={ () => { setStep('password'); } }
                                className={ `btn-primary mx-auto mb-4 flex h-12 w-fit items-center gap-2 rounded-lg px-4 outline-0 ${ !saved ? 'cursor-not-allowed! opacity-50' : '' }` }>

                                {
                                    T('CreateWallet.Continue')
                                }

                                <IoIosArrowForward size={ 16 } className={ flip } />

                            </button>
                        </>
                    )
                }

                {
                    step === 'password' && (
                        <>
                            <div className='text-center text-large font-bold text-txt-normal'>

                                {
                                    T('CreateWallet.PasswordTitle')
                                }

                            </div>

                            <label className='mt-2 flex flex-col gap-2'>

                                <span className='text-tiny text-txt-muted'>

                                    {
                                        T('CreateWallet.Password')
                                    }

                                </span>

                                <div className='relative flex items-center'>

                                    <HiOutlineLockClosed className='absolute left-3 text-txt-muted' size={ 20 } />

                                    <input
                                        type={ showPassword ? 'text' : 'password' }
                                        value={ password }
                                        placeholder={ T('CreateWallet.Password') }
                                        onChange={ (e) => { setPassword(e.target.value); } }
                                        className='glass-input h-12 w-full rounded-xl pr-10 pl-12 text-small outline-input-primary focus:outline-2' />

                                    <button
                                        type='button'
                                        onClick={ () => { setShowPassword(!showPassword); } }
                                        className='absolute right-3 text-txt-muted hover:text-txt-normal'>

                                        {
                                            showPassword ? <HiEyeOff size={ 18 } /> : <HiEye size={ 18 } />
                                        }

                                    </button>

                                </div>

                            </label>

                            <label className='flex flex-col gap-2'>

                                <span className='text-tiny text-txt-muted'>

                                    {
                                        T('CreateWallet.Confirm')
                                    }

                                </span>

                                <div className='relative flex items-center'>

                                    <HiOutlineLockClosed className='absolute left-3 text-txt-muted' size={ 20 } />

                                    <input
                                        type={ showPassword2 ? 'text' : 'password' }
                                        value={ password2 }
                                        placeholder={ T('CreateWallet.Confirm') }
                                        onChange={ (e) => { setPassword2(e.target.value); } }
                                        className='glass-input h-12 w-full rounded-xl pr-10 pl-12 text-small outline-input-primary focus:outline-2' />

                                    <button
                                        type='button'
                                        onClick={ () => { setShowPassword2(!showPassword2); } }
                                        className='absolute right-3 text-txt-muted hover:text-txt-normal'>

                                        {
                                            showPassword2 ? <HiEyeOff size={ 18 } /> : <HiEye size={ 18 } />
                                        }

                                    </button>

                                </div>

                                {
                                    mismatch && (
                                        <span className='text-tiny text-red-400'>

                                            {
                                                T('CreateWallet.Mismatch')
                                            }

                                        </span>
                                    )
                                }

                            </label>

                            <label className='flex h-10 cursor-pointer items-center gap-2'>

                                <button
                                    type='button'
                                    onClick={ () => { setAgree(!agree); } }
                                    className='glass-input flex size-5 items-center justify-center rounded-sm'>

                                    {
                                        agree && <FiCheck size={ 16 } className='text-txt-muted' />
                                    }

                                </button>

                                <div className='text-tiny text-txt-muted'>

                                    {
                                        T('CreateWallet.Agreement')
                                    }

                                </div>

                            </label>

                            <button
                                type='button'
                                disabled={ !formValid }
                                onClick={ handleCreate }
                                className={ `btn-primary mx-auto mb-4 h-12 w-fit rounded-lg px-4 py-2 outline-0 ${ !formValid ? 'cursor-not-allowed! opacity-50' : '' }` }>

                                {
                                    T('CreateWallet.Submit')
                                }

                            </button>
                        </>
                    )
                }

            </motion.div>
        </>
    );
}

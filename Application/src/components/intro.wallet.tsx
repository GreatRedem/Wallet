import { useState } from 'react';
import { motion } from 'motion/react';
import { IoClose } from 'react-icons/io5';
import { FaAngleDown } from 'react-icons/fa6';
import { HiEye, HiEyeOff, HiOutlineLockClosed } from 'react-icons/hi';

import { T } from '../utility/language';

export default function IntroWallet({ onClose }: { onClose: () => void })
{
    const [ agree, setAgree ] = useState(false);
    const [ password, setPassword ] = useState('');
    const [ password2, setPassword2 ] = useState('');
    const [ showPassword, setShowPassword ] = useState(false);
    const [ showPassword2, setShowPassword2 ] = useState(false);

    return (
        <>
            <motion.div
                initial={ { opacity: 0 } }
                animate={ { opacity: 1 } }
                exit={ { opacity: 0 } }
                className='absolute inset-0 z-10 size-full bg-black/25 backdrop-blur-xs'
                onClick={ onClose } />

            <motion.div
                initial={ { y: '-100%' } }
                animate={ { y: '0%' } }
                exit={ { y: '-100%' } }
                transition={ { duration: 0.4 } }
                className='absolute inset-0 z-20 flex h-fit flex-col gap-2 rounded-b-3xl bg-base-2 px-4'>

                <button
                    onClick={ onClose }
                    className='btn-normal mt-4 flex size-10 items-center justify-center rounded-lg outline-0'>

                    <IoClose size={ 24 } />

                </button>

                <div className='flex flex-col'>

                    <div className='text-center text-large font-bold text-txt-normal'>

                        {
                            T('CreateWallet.Title')
                        }

                    </div>

                    <div className='text-center text-small text-txt-muted'>

                        {
                            T('CreateWallet.Subtitle')
                        }

                    </div>

                </div>

                <label className='mt-4 flex flex-col gap-2'>

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
                            className='h-12 w-full rounded-lg border border-input-normal pr-10 pl-12 text-small outline-input-primary focus:outline-2' />

                        <button
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
                            className='h-12 w-full rounded-lg border border-input-normal pr-10 pl-12 text-small outline-input-primary focus:outline-2' />

                        <button
                            onClick={ () => { setShowPassword2(!showPassword2); } }
                            className='absolute right-3 text-txt-muted hover:text-txt-normal'>

                            {
                                showPassword2 ? <HiEyeOff size={ 18 } /> : <HiEye size={ 18 } />
                            }

                        </button>

                    </div>

                </label>

                <label
                    className='flex h-10 items-center gap-2'>

                    <button
                        onClick={ () => { setAgree(!agree); } }
                        className='flex size-5 items-center justify-center rounded-sm border border-input-normal focus:outline-2'>

                        {
                            agree && <FaAngleDown size={ 10 } className='text-txt-muted' />
                        }

                    </button>

                    <span className='text-tiny text-txt-muted'>

                        {
                            T('CreateWallet.Agreement')
                        }

                    </span>

                </label>

                <button
                    className='btn-primary mx-auto mb-4 h-12 w-fit rounded-lg px-4 py-2 outline-0'>

                    {
                        T('Intro.Wallet.Create')
                    }

                </button>

            </motion.div>
        </>
    );
}

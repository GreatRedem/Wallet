import { useState } from 'react';
import { motion } from 'motion/react';
import { FiCheck } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';
import { HiEye, HiEyeOff, HiOutlineLockClosed } from 'react-icons/hi';

import { T } from '../utility/language';

export default function IntroImport({ onClose }: { onClose: () => void })
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
                className='absolute z-10 size-full cursor-pointer bg-black/25 backdrop-blur-xs'
                onClick={ onClose } />

            <motion.div
                initial={ { y: '-100%' } }
                animate={ { y: '0%' } }
                exit={ { y: '-100%' } }
                transition={ { type: 'tween' } }
                className='glass-panel absolute inset-0 z-20 mx-2 flex h-fit flex-col gap-2 rounded-b-3xl px-4'>

                <button
                    type='button'
                    onClick={ onClose }
                    className='btn-muted mt-4 flex size-10 items-center justify-center rounded-lg'>

                    <IoClose size={ 24 } />

                </button>

                <div className='flex flex-col'>

                    <div className='text-center text-large font-bold text-txt-normal'>

                        {
                            T('Intro.ImportWallet.Title')
                        }

                    </div>

                    <div className='text-center text-small text-txt-muted'>

                        {
                            T('Intro.ImportWallet.Subtitle')
                        }

                    </div>

                </div>

                <label className='mt-4 flex flex-col gap-2'>

                    <div className='text-tiny text-txt-muted'>

                        {
                            T('Intro.ImportWallet.Password')
                        }

                    </div>

                    <div className='relative flex items-center'>

                        <HiOutlineLockClosed className='absolute left-4 text-txt-muted' size={ 20 } />

                        <input
                            type={ showPassword ? 'text' : 'password' }
                            value={ password }
                            placeholder={ T('Intro.ImportWallet.Password') }
                            onChange={ (e) => { setPassword(e.target.value); } }
                            className='glass-input h-12 w-full rounded-lg px-12 text-small' />

                        <button
                            type='button'
                            onClick={ () => { setShowPassword(!showPassword); } }
                            className='btn-muted absolute right-4 cursor-pointer rounded-lg text-txt-muted hover:text-txt-normal'>

                            {
                                showPassword ? <HiEyeOff size={ 18 } /> : <HiEye size={ 18 } />
                            }

                        </button>

                    </div>

                </label>

                <label className='flex flex-col gap-2'>

                    <div className='text-tiny text-txt-muted'>

                        {
                            T('Intro.ImportWallet.Confirm')
                        }

                    </div>

                    <div className='relative flex items-center'>

                        <HiOutlineLockClosed className='absolute left-4 text-txt-muted' size={ 20 } />

                        <input
                            type={ showPassword2 ? 'text' : 'password' }
                            value={ password2 }
                            placeholder={ T('Intro.ImportWallet.Confirm') }
                            onChange={ (e) => { setPassword2(e.target.value); } }
                            className='glass-input h-12 w-full rounded-lg px-12 text-small' />

                        <button
                            type='button'
                            onClick={ () => { setShowPassword2(!showPassword2); } }
                            className='btn-muted absolute right-4 cursor-pointer rounded-lg text-txt-muted hover:text-txt-normal'>

                            {
                                showPassword2 ? <HiEyeOff size={ 18 } /> : <HiEye size={ 18 } />
                            }

                        </button>

                    </div>

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
                            T('Intro.ImportWallet.Agreement')
                        }

                    </div>

                </label>

                <button
                    type='button'
                    disabled={ !agree }
                    className={ `btn-primary mx-auto mb-4 h-12 w-fit rounded-lg px-4 py-2 ${ !agree ? 'cursor-not-allowed! opacity-50' : '' }` }>

                    {
                        T('Intro.ImportWallet.Submit1')
                    }

                </button>

            </motion.div>
        </>
    );
}

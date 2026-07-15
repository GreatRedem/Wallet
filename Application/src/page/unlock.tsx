import { useState } from 'react';
import { motion } from 'motion/react';
import { FaQuestion } from 'react-icons/fa';
import { invoke } from '@tauri-apps/api/core';
import { HiEye, HiEyeOff, HiOutlineLockClosed } from 'react-icons/hi';

import IntroPage from './intro';
import DashboardPage from './dashboard';

import { T } from '../utility/language';
import { openPage } from '../utility/context';
import { getValue, getValueEncrypted } from '../utility/storage';

export default function UnlockComponent()
{
    const [ error, setError ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ isLoading, setIsLoading ] = useState(false);
    const [ showPassword, setShowPassword ] = useState(false);

    const onUnlock = async() =>
    {
        setError('');

        if (password.trim().length === 0)
        {
            setError(T('Unlock.ErrorRequired'));

            return;
        }

        setIsLoading(true);

        const storedHash = await getValue('Wallet.Password');

        if (storedHash === undefined)
        {
            openPage(IntroPage);

            return;
        }

        const isValid = await invoke<boolean>('password_verify', { password, expectedHash: storedHash });

        if (!isValid)
        {
            setError(T('Unlock.ErrorInvalid'));

            return;
        }

        const mnemonic = await getValueEncrypted('Wallet.Mnemonic', password);

        if (mnemonic === undefined)
        {
            setError(T('Unlock.ErrorMissing'));

            return;
        }

        openPage(DashboardPage, { mnemonic });

        setIsLoading(false);
    };

    return (
        <motion.div
            initial={ { opacity: 0 } }
            animate={ { opacity: 1 } }
            transition={ { type: 'tween' } }
            className='flex size-full items-center justify-center bg-base-1 px-4'>

            <div className='glass-panel flex w-full max-w-md flex-col gap-4 rounded-3xl p-6'>

                <div className='flex items-center justify-between gap-2'>

                    <div>

                        <div className='text-large font-semibold text-txt-normal'>

                            { T('Unlock.Title') }

                        </div>

                        <div className='text-tiny text-txt-muted'>

                            { T('Unlock.Subtitle') }

                        </div>

                    </div>

                    <button
                        type='button'
                        className='btn-muted flex size-10 shrink-0 items-center justify-center rounded-lg'>

                        <FaQuestion size={ 18 } />

                    </button>

                </div>

                {
                    error.length > 0 &&
                    (
                        <div className='mt-2 rounded-xl bg-txt-error/10 px-3 py-2 text-center text-small text-txt-error'>

                            { error }

                        </div>
                    )
                }

                <label className='flex flex-col gap-2'>

                    <div className='text-tiny text-txt-muted'>

                        { T('Unlock.Password') }

                    </div>

                    <div className='relative flex items-center'>

                        <HiOutlineLockClosed className='absolute left-4 text-txt-muted' size={ 18 } />

                        <input
                            type={ showPassword ? 'text' : 'password' }
                            value={ password }
                            onChange={ (event) => { setPassword(event.target.value); } }
                            // eslint-disable-next-line @typescript-eslint/strict-void-return
                            onKeyDown={ (event) => event.key === 'Enter' && void onUnlock() }
                            placeholder={ T('Unlock.Password') }
                            className='glass-input h-12 w-full rounded-xl px-12 text-small' />

                        <button
                            type='button'
                            onClick={ () => { setShowPassword((value) => !value); } }
                            className='absolute right-4 rounded-lg text-txt-muted'>

                            {
                                showPassword ? <HiEyeOff size={ 18 } /> : <HiEye size={ 18 } />
                            }

                        </button>

                    </div>

                </label>

                <button
                    type='button'
                    onClick={ () => { void onUnlock(); } }
                    disabled={ isLoading }
                    className='btn-primary mx-auto flex h-12 w-fit items-center justify-center rounded-xl px-8 py-2 disabled:cursor-not-allowed! disabled:opacity-60'>

                    {
                        isLoading ? T('Unlock.Loading') : T('Unlock.Submit')
                    }

                </button>

            </div>

        </motion.div>
    );
}

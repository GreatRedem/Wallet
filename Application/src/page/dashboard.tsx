import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { FiCheckCircle, FiCopy, FiLock, FiSend } from 'react-icons/fi';
import { HiOutlineKey } from 'react-icons/hi';

import WalletManager from '../core/wallet';
import { openPage } from '../utility/context';
import { T } from '../utility/language';
import UnlockPage from './unlock';

interface DashboardPageProps
{
    mnemonic: string;
}

export default function DashboardPage({ mnemonic }: DashboardPageProps)
{
    const wallet = useMemo(() => new WalletManager(mnemonic, 0), [ mnemonic ]);
    const [ message, setMessage ] = useState('');
    const [ signature, setSignature ] = useState('');
    const [ status, setStatus ] = useState('');

    const onCopyAddress = async() =>
    {
        try
        {
            await navigator.clipboard.writeText(wallet.toString());
            setStatus(T('Dashboard.Copied'));
        }
        catch
        {
            setStatus(T('Dashboard.CopyFailed'));
        }
    };

    const onSignMessage = async() =>
    {
        if (message.trim().length === 0)
        {
            setStatus(T('Dashboard.SignHint'));

            return;
        }

        try
        {
            const signed = await wallet.sign(message);

            setSignature(signed);
            setStatus(T('Dashboard.Signed'));
        }
        catch
        {
            setStatus(T('Dashboard.SignFailed'));
        }
    };

    const address = wallet.toString();

    return (
        <motion.div
            initial={ { opacity: 0, y: 16 } }
            animate={ { opacity: 1, y: 0 } }
            transition={ { type: 'tween', duration: 0.2 } }
            className='flex size-full flex-col bg-base-1 p-4'>

            <div className='glass-panel rounded-3xl p-4'>

                <div className='mb-4 flex items-start justify-between gap-3'>

                    <div>

                        <div className='text-large font-semibold text-txt-normal'>

                            { T('Dashboard.Title') }

                        </div>

                        <div className='text-small text-txt-muted'>

                            { T('Dashboard.Subtitle') }

                        </div>

                    </div>

                    <button
                        type='button'
                        onClick={ () => { openPage(UnlockPage); } }
                        className='btn-muted flex h-10 items-center gap-2 rounded-lg px-3 text-small'>

                        <FiLock size={ 16 } />

                        { T('Dashboard.Lock') }

                    </button>

                </div>

                <div className='rounded-2xl border border-white/10 bg-white/5 p-3'>

                    <div className='mb-2 flex items-center gap-2 text-tiny font-semibold tracking-[0.2em] text-txt-muted uppercase'>

                        <HiOutlineKey size={ 16 } />

                        { T('Dashboard.Address') }

                    </div>

                    <div className='text-small break-all text-txt-normal'>

                        { address }

                    </div>

                    <button
                        type='button'
                        onClick={ () => { void onCopyAddress(); } }
                        className='btn-normal mt-3 flex h-10 items-center gap-2 rounded-lg px-3 text-small'>

                        <FiCopy size={ 16 } />

                        { T('Dashboard.Copy') }

                    </button>

                </div>

            </div>

            <div className='mt-4 flex-1 rounded-3xl border border-white/10 bg-white/5 p-4'>

                <div className='mb-3 text-large font-semibold text-txt-normal'>

                    { T('Dashboard.Message') }

                </div>

                <textarea
                    value={ message }
                    onChange={ (event) => { setMessage(event.target.value); } }
                    placeholder={ T('Dashboard.SignPlaceholder') }
                    className='glass-input min-h-24 w-full rounded-2xl p-3 text-small' />

                <button
                    type='button'
                    onClick={ () => { void onSignMessage(); } }
                    className='btn-primary mt-3 flex h-11 items-center gap-2 rounded-xl px-3 text-small'>

                    <FiSend size={ 16 } />

                    { T('Dashboard.Sign') }

                </button>

                <div className='mt-4 rounded-2xl bg-black/10 p-3 text-small text-txt-muted'>

                    <div className='mb-2 flex items-center gap-2'>

                        <FiCheckCircle size={ 16 } className='text-txt-normal' />

                        { T('Dashboard.Signature') }

                    </div>

                    <div className='text-tiny break-all text-txt-normal'>

                        {
                            signature.length > 0 ? signature : T('Dashboard.EmptySignature')
                        }

                    </div>

                </div>

                {
                    status.length > 0 &&
                    (
                        <div className='mt-3 text-center text-small text-txt-normal'>

                            { status }

                        </div>
                    )
                }

            </div>

        </motion.div>
    );
}

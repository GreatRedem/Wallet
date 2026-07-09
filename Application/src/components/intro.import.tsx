import { useState } from 'react';
import { motion } from 'motion/react';
import { IoClose } from 'react-icons/io5';
import { FiCheck } from 'react-icons/fi';
import { HiEye, HiEyeOff, HiOutlineLockClosed } from 'react-icons/hi';
import { LuFileText, LuKeyRound } from 'react-icons/lu';

import wallet from '../core/wallet';

import { T } from '../utility/language';

type ImportTab = 'phrase' | 'key';

export default function IntroImport({ onClose }: { onClose: () => void })
{
    const [ activeTab, setActiveTab ] = useState<ImportTab>('phrase');

    // Phrase form state
    const [ phrase, setPhrase ] = useState('');
    const [ phrasePassword, setPhrasePassword ] = useState('');
    const [ phrasePassword2, setPhrasePassword2 ] = useState('');
    const [ showPhrasePassword, setShowPhrasePassword ] = useState(false);
    const [ showPhrasePassword2, setShowPhrasePassword2 ] = useState(false);
    const [ phraseAgree, setPhraseAgree ] = useState(false);

    // Private key form state
    const [ privateKey, setPrivateKey ] = useState('');
    const [ keyPassword, setKeyPassword ] = useState('');
    const [ keyPassword2, setKeyPassword2 ] = useState('');
    const [ showKeyPassword, setShowKeyPassword ] = useState(false);
    const [ showKeyPassword2, setShowKeyPassword2 ] = useState(false);
    const [ keyAgree, setKeyAgree ] = useState(false);

    const phraseValid =
    phrase.trim().split(/\s+/).length >= 12 &&
    phrasePassword.length > 0 &&
    phrasePassword === phrasePassword2 &&
    phraseAgree;

    const keyValid =
    privateKey.replace('0x', '').length === 64 &&
    /^[0-9a-fA-F]+$/.test(privateKey.replace('0x', '')) &&
    keyPassword.length > 0 &&
    keyPassword === keyPassword2 &&
    keyAgree;

    const handleImportPhrase = () =>
    {
        if (!phraseValid)
        {
            return;
        }

        const isValid = wallet.Validate(phrase.trim());

        if (!isValid)
        {
            return;
        }

        // TODO: persist wallet + password, navigate to next page
        // eslint-disable-next-line no-console
        console.log('import phrase', phrase, phrasePassword);

        onClose();
    };

    const handleImportKey = () =>
    {
        if (!keyValid)
        {
            return;
        }

        try
        {
            wallet.FromPrivateKey(privateKey.replace('0x', ''));

            // TODO: persist wallet + password, navigate to next page
            // eslint-disable-next-line no-console
            console.log('import key', privateKey, keyPassword);

            onClose();
        }
        catch
        {
            // invalid key — validation should catch this already, but guard anyway
        }
    };

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
                className='glass-panel absolute inset-0 z-20 flex h-fit max-h-full flex-col gap-2 overflow-y-auto rounded-b-3xl px-4'>

                <button
                    type='button'
                    onClick={ onClose }
                    className='btn-normal mt-4 flex size-10 items-center justify-center rounded-lg outline-0'>

                    <IoClose size={ 24 } />

                </button>

                <div className='flex flex-col'>

                    <div className='text-center text-large font-bold text-txt-normal'>

                        {
                            T('ImportWallet.Title')
                        }

                    </div>

                    <div className='text-center text-small text-txt-muted'>

                        {
                            T('ImportWallet.Subtitle')
                        }

                    </div>

                </div>

                {/* Tabs */}
                <div className='mt-4 flex gap-2'>

                    <button
                        type='button'
                        onClick={ () => { setActiveTab('phrase'); } }
                        className={
                            `flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg text-small font-bold outline-0 transition-colors duration-200 ${
                                activeTab === 'phrase' ?
                                    'bg-btn-primary text-txt-reverse' :
                                    'bg-btn-normal text-txt-normal hover:bg-btn-normal-hover'
                            }`
                        }>

                        <LuFileText size={ 18 } />

                        {
                            T('ImportWallet.PhraseTab')
                        }

                    </button>

                    <button
                        type='button'
                        onClick={ () => { setActiveTab('key'); } }
                        className={
                            `flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg text-small font-bold outline-0 transition-colors duration-200 ${
                                activeTab === 'key' ?
                                    'bg-btn-primary text-txt-reverse' :
                                    'bg-btn-normal text-txt-normal hover:bg-btn-normal-hover'
                            }`
                        }>

                        <LuKeyRound size={ 18 } />

                        {
                            T('ImportWallet.KeyTab')
                        }

                    </button>

                </div>

                {/* Phrase tab */}
                {
                    activeTab === 'phrase' && (
                        <>
                            <label className='mt-2 flex flex-col gap-2'>

                                <span className='text-tiny text-txt-muted'>

                                    {
                                        T('ImportWallet.Phrase')
                                    }

                                </span>

                                <textarea
                                    value={ phrase }
                                    placeholder={ T('ImportWallet.PhrasePlaceholder') }
                                    onChange={ (e) => { setPhrase(e.target.value); } }
                                    rows={ 4 }
                                    className='glass-input h-24 w-full resize-none rounded-xl p-3 text-small outline-input-primary focus:outline-2' />

                            </label>

                            <label className='flex flex-col gap-2'>

                                <span className='text-tiny text-txt-muted'>

                                    {
                                        T('CreateWallet.Password')
                                    }

                                </span>

                                <div className='relative flex items-center'>

                                    <HiOutlineLockClosed className='absolute left-3 text-txt-muted' size={ 20 } />

                                    <input
                                        type={ showPhrasePassword ? 'text' : 'password' }
                                        value={ phrasePassword }
                                        placeholder={ T('CreateWallet.Password') }
                                        onChange={ (e) => { setPhrasePassword(e.target.value); } }
                                        className='glass-input h-12 w-full rounded-xl pr-10 pl-12 text-small outline-input-primary focus:outline-2' />

                                    <button
                                        type='button'
                                        onClick={ () => { setShowPhrasePassword(!showPhrasePassword); } }
                                        className='absolute right-3 text-txt-muted hover:text-txt-normal'>

                                        {
                                            showPhrasePassword ? <HiEyeOff size={ 18 } /> : <HiEye size={ 18 } />
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
                                        type={ showPhrasePassword2 ? 'text' : 'password' }
                                        value={ phrasePassword2 }
                                        placeholder={ T('CreateWallet.Confirm') }
                                        onChange={ (e) => { setPhrasePassword2(e.target.value); } }
                                        className='glass-input h-12 w-full rounded-xl pr-10 pl-12 text-small outline-input-primary focus:outline-2' />

                                    <button
                                        type='button'
                                        onClick={ () => { setShowPhrasePassword2(!showPhrasePassword2); } }
                                        className='absolute right-3 text-txt-muted hover:text-txt-normal'>

                                        {
                                            showPhrasePassword2 ? <HiEyeOff size={ 18 } /> : <HiEye size={ 18 } />
                                        }

                                    </button>

                                </div>

                            </label>

                            <label className='flex h-10 items-center gap-2'>

                                <button
                                    type='button'
                                    onClick={ () => { setPhraseAgree(!phraseAgree); } }
                                    className='glass-input flex size-5 items-center justify-center rounded-md focus:outline-2'>

                                    {
                                        phraseAgree && <FiCheck size={ 10 } className='text-txt-muted' />
                                    }

                                </button>

                                <span className='text-tiny text-txt-muted'>

                                    {
                                        T('CreateWallet.Agreement')
                                    }

                                </span>

                            </label>

                            <button
                                type='button'
                                disabled={ !phraseValid }
                                onClick={ handleImportPhrase }
                                className='btn-primary mx-auto mb-4 h-12 w-fit rounded-lg px-4 py-2 outline-0'>

                                {
                                    T('ImportWallet.Import')
                                }

                            </button>
                        </>
                    )
                }

                {/* Private key tab */}
                {
                    activeTab === 'key' && (
                        <>
                            <label className='mt-2 flex flex-col gap-2'>

                                <span className='text-tiny text-txt-muted'>

                                    {
                                        T('ImportWallet.PrivateKey')
                                    }

                                </span>

                                <input
                                    value={ privateKey }
                                    placeholder={ T('ImportWallet.PrivateKeyPlaceholder') }
                                    onChange={ (e) => { setPrivateKey(e.target.value); } }
                                    className='glass-input h-12 w-full rounded-xl px-3 font-mono text-small outline-input-primary focus:outline-2' />

                            </label>

                            <label className='flex flex-col gap-2'>

                                <span className='text-tiny text-txt-muted'>

                                    {
                                        T('CreateWallet.Password')
                                    }

                                </span>

                                <div className='relative flex items-center'>

                                    <HiOutlineLockClosed className='absolute left-3 text-txt-muted' size={ 20 } />

                                    <input
                                        type={ showKeyPassword ? 'text' : 'password' }
                                        value={ keyPassword }
                                        placeholder={ T('CreateWallet.Password') }
                                        onChange={ (e) => { setKeyPassword(e.target.value); } }
                                        className='glass-input h-12 w-full rounded-xl pr-10 pl-12 text-small outline-input-primary focus:outline-2' />

                                    <button
                                        type='button'
                                        onClick={ () => { setShowKeyPassword(!showKeyPassword); } }
                                        className='absolute right-3 text-txt-muted hover:text-txt-normal'>

                                        {
                                            showKeyPassword ? <HiEyeOff size={ 18 } /> : <HiEye size={ 18 } />
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
                                        type={ showKeyPassword2 ? 'text' : 'password' }
                                        value={ keyPassword2 }
                                        placeholder={ T('CreateWallet.Confirm') }
                                        onChange={ (e) => { setKeyPassword2(e.target.value); } }
                                        className='glass-input h-12 w-full rounded-xl pr-10 pl-12 text-small outline-input-primary focus:outline-2' />

                                    <button
                                        type='button'
                                        onClick={ () => { setShowKeyPassword2(!showKeyPassword2); } }
                                        className='absolute right-3 text-txt-muted hover:text-txt-normal'>

                                        {
                                            showKeyPassword2 ? <HiEyeOff size={ 18 } /> : <HiEye size={ 18 } />
                                        }

                                    </button>

                                </div>

                            </label>

                            <label className='flex h-10 items-center gap-2'>

                                <button
                                    type='button'
                                    onClick={ () => { setKeyAgree(!keyAgree); } }
                                    className='glass-input flex size-5 items-center justify-center rounded-md focus:outline-2'>

                                    {
                                        keyAgree && <FiCheck size={ 10 } className='text-txt-muted' />
                                    }

                                </button>

                                <span className='text-tiny text-txt-muted'>

                                    {
                                        T('CreateWallet.Agreement')
                                    }

                                </span>

                            </label>

                            <button
                                type='button'
                                disabled={ !keyValid }
                                onClick={ handleImportKey }
                                className='btn-primary mx-auto mb-4 h-12 w-fit rounded-lg px-4 py-2 outline-0'>

                                {
                                    T('ImportWallet.Import')
                                }

                            </button>
                        </>
                    )
                }

            </motion.div>

        </>
    );
}

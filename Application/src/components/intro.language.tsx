import { motion } from 'motion/react';
import { IoClose } from 'react-icons/io5';
import { FiCheck } from 'react-icons/fi';

import { T, getLanguage, setLanguage, type LanguageType } from '../utility/language';

interface LanguageOption
{
    code: LanguageType;
    flag: string;
    nativeName: string;
}

const languageOptions: LanguageOption[] =
[
    { code: 'en', flag: '\u{1F1FA}\u{1F1F8}', nativeName: 'English' },
    { code: 'fa', flag: '\u{1F1EE}\u{1F1F7}', nativeName: '\u0641\u0627\u0631\u0633\u06CC' }
];

export default function IntroLanguage({ onClose }: { onClose: () => void })
{
    const current = getLanguage();

    const handleSelect = async(code: LanguageType) =>
    {
        await setLanguage(code);

        onClose();
    };

    return (
        <>

            <motion.div
                initial={ { opacity: 0 } }
                animate={ { opacity: 1 } }
                exit={ { opacity: 0 } }
                className='absolute inset-0 z-10 size-full bg-black/25 backdrop-blur-xs'
                onClick={ onClose } />

            <div className='absolute inset-0 z-20 flex size-full items-center justify-center'>

                <motion.div
                    initial={ { opacity: 0, scale: 0.9 } }
                    animate={ { opacity: 1, scale: 1 } }
                    exit={ { opacity: 0, scale: 0.9 } }
                    transition={ { duration: 0.2 } }
                    className='flex w-72 flex-col gap-2 rounded-2xl bg-base-2 p-4 shadow-lg'>

                    <div className='flex items-center justify-between'>

                        <h2 className='text-medium font-bold text-txt-normal'>

                            {
                                T('Intro.Select')
                            }

                        </h2>

                        <button
                            onClick={ onClose }
                            className='btn-normal flex size-8 items-center justify-center rounded-lg outline-0'>

                            <IoClose size={ 20 } />

                        </button>

                    </div>

                    <div className='flex flex-col gap-1'>

                        {
                            languageOptions.map((lang) =>
                            {
                                const isActive = lang.code === current.code;

                                return (
                                    <button
                                        key={ lang.code }
                                        onClick={ () => { void handleSelect(lang.code); } }
                                        className='flex h-12 cursor-pointer items-center gap-3 rounded-xl px-3 text-start outline-0 transition-colors duration-200 hover:bg-btn-normal active:bg-btn-normal-active'>

                                        <span className='text-xl'>

                                            { lang.flag }

                                        </span>

                                        <span className='flex-1 text-small text-txt-normal'>

                                            { lang.nativeName }

                                        </span>

                                        {
                                            isActive &&
                                            <FiCheck size={ 18 } className='text-btn-primary' />
                                        }

                                    </button>
                                );
                            })
                        }

                    </div>

                </motion.div>

            </div>

        </>
    );
}

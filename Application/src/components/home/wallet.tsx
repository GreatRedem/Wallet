import { GrLanguage } from 'react-icons/gr';
import { PiPaintBrushHousehold } from 'react-icons/pi';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa6';

import LanguageModal from '../../components/splash/language.modal';

import Theme from '../../utility/theme';
import Context from '../../utility/context';

import { T } from '../../utility/language';

export default function WalletNavigation()
{
    return (
        <div className='absolute flex h-full w-full flex-col items-center bg-base'>

            <div className='flex w-full justify-between p-[16px]'>

                <button
                    className='group flex h-[40px] cursor-pointer items-center rounded-[8px] border border-base-border outline-base-outline duration-200 hover:bg-base-hover'
                    onClick={ () => { Context.OpenModal(LanguageModal); } }>

                    <GrLanguage className='m-[8px] size-[24px] text-base-text/75 duration-200 group-hover:text-base-text' />

                </button>

                <button
                    className='group flex h-[32px] cursor-pointer items-center gap-[8px] rounded-[8px] border border-base-border px-[8px] outline-base-outline duration-200 hover:bg-base-hover'
                    onClick={ () => { Context.OpenModal(LanguageModal); } }>

                    <GrLanguage className='size-[16px] text-base-text/75 duration-200 group-hover:text-base-text' />

                    <div className='text-base-text'>

                        {
                            T('Home.Wallet.Wallet')
                        }

                    </div>

                    <FaArrowDown className='size-[16px] text-base-text/75 duration-200 group-hover:text-base-text' />

                </button>

                <button
                    className='group flex h-[40px] cursor-pointer items-center rounded-[8px] border border-base-border outline-base-outline duration-200 hover:bg-base-hover'
                    onClick={ () => Theme.Toggle() }>

                    <PiPaintBrushHousehold className='m-[8px] size-[24px] text-base-text/75 duration-200 group-hover:text-base-text' />

                </button>

            </div>

            <div className='m-[16px] flex flex-col items-center justify-center gap-[8px]'>

                <div className='text-[24px] font-bold text-base-text'>0$</div>

            </div>

            <div className='m-[16px] flex items-center justify-center gap-[8px]'>

                <div className='flex w-[60px] cursor-pointer flex-col items-center justify-center gap-[8px] rounded-[8px] p-[8px] hover:bg-base-hover'>

                    <FaArrowUp className='size-[16px] text-base-text duration-200 group-hover:text-base-text' />

                    <div className='text-[12px] text-base-text'>

                        Send

                    </div>

                </div>

                <div className='flex w-[60px] cursor-pointer flex-col items-center justify-center gap-[8px] rounded-[8px] p-[8px] hover:bg-base-hover'>

                    <FaArrowDown className='size-[16px] text-base-text duration-200 group-hover:text-base-text' />

                    <div className='text-[12px] text-base-text'>

                        Receive

                    </div>

                </div>

                <div className='flex w-[60px] cursor-pointer flex-col items-center justify-center gap-[8px] rounded-[8px] p-[8px] hover:bg-base-hover'>

                    <PiPaintBrushHousehold className='size-[16px] text-base-text duration-200 group-hover:text-base-text' />

                    <div className='text-[12px] text-base-text'>

                        Sync

                    </div>

                </div>

            </div>

            <div className='m-[16px] flex cursor-pointer items-center justify-center gap-[8px] rounded-[8px] border border-base-border p-[8px] hover:bg-base-hover'>

                <div className='text-[16px]'>

                    Transaction History

                </div>

                <FaArrowDown className='size-[16px] text-primary duration-200 group-hover:text-base-text' />

            </div>

        </div>);
}

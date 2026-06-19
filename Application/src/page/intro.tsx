import { FiArrowDown } from 'react-icons/fi';

import { Text } from '../components/text';
import { Background } from '../components/background';
import { ButtonIcon, Button } from '../components/button';

import { T } from '../utility/language';

import Logo from '../assets/image/logo.png';

export default function IntroPage()
{
    return (
        <Background type='normal' className='flex size-full flex-col p-2.5'>

            <div className='flex h-10 w-full items-center gap-2'>

                <ButtonIcon icon={ <img src={ Logo } /> } size='medium' />

                <Text className='flex-1' size='large' message={ T('App.Name') } bold />

                <Button size='small' startIcon={ <img src={ Logo } className='size-5' /> } endIcon={ <FiArrowDown className='size-4' /> } message={ T('English') } />

            </div>

        </Background>
    );
}

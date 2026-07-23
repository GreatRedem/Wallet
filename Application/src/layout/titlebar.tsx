import type { UnlistenFn } from '@tauri-apps/api/event';

import { useCallback, useEffect, useState } from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { VscChromeClose, VscChromeMaximize, VscChromeMinimize, VscChromeRestore } from 'react-icons/vsc';

import { T } from '../utility/language';

import Logo from '../assets/image/logo.png';

/**
 * TitleBar - Custom window chrome for frameless desktop windows.
 *
 * The window is created with `decorations: false`, so the app has to provide its own drag region and window controls.
 *
 * The bar keeps a fixed `ltr` direction so the controls stay where a Windows user expects them, regardless of the active UI language.
 * @returns {JSX.Element} The title bar element.
 */
export default function TitleBar()
{
    const [ maximized, setMaximized ] = useState(false);

    const onMinimize = useCallback(() =>
    {
        void getCurrentWindow().minimize();
    }, [ ]);

    const onToggleMaximize = useCallback(() =>
    {
        void getCurrentWindow().toggleMaximize();
    }, [ ]);

    const onClose = useCallback(() =>
    {
        void getCurrentWindow().hide();
    }, [ ]);

    useEffect(() =>
    {
        const appWindow = getCurrentWindow();

        let mounted = true;
        let unlisten: UnlistenFn | undefined;

        /**
         * Pull the current maximized state from the window so the toggle icon matches reality.
         *
         * The window can also be maximized outside of this component (snap gestures, double-click on the drag region), which is why the state is read back instead of being tracked locally.
         */
        const sync = async() =>
        {
            const state = await appWindow.isMaximized();

            if (mounted)
            {
                setMaximized(state);
            }
        };

        void sync();

        void appWindow.onResized(() => { void sync(); }).then((handler) =>
        {
            if (mounted)
            {
                unlisten = handler;

                return;
            }

            handler();
        });

        return () =>
        {
            mounted = false;

            unlisten?.();
        };
    }, [ ]);

    return (
        <div
            data-tauri-drag-region
            className='titlebar flex h-8 shrink-0 items-center justify-between cursor-pointer'>

            <div className='flex items-center gap-2 px-2'>

                <img
                    src={ Logo }
                    className='size-4' />

                <div className='text-tiny text-txt-normal'>

                    {
                        T('App.Name')
                    }

                </div>

            </div>

            <div className='flex h-full'>

                <button
                    type='button'
                    onClick={ onMinimize }
                    className='titlebar-button'>

                    <VscChromeMinimize size={ 14 } />

                </button>

                <button
                    type='button'
                    onClick={ onToggleMaximize }
                    className='titlebar-button'>

                    {
                        maximized ? <VscChromeRestore size={ 14 } /> : <VscChromeMaximize size={ 14 } />
                    }

                </button>

                <button
                    type='button'
                    onClick={ onClose }
                    className='titlebar-button titlebar-close'>

                    <VscChromeClose size={ 14 } />

                </button>

            </div>

        </div>
    );
}

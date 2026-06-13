import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { TrayIcon } from '@tauri-apps/api/tray';
import { platform } from '@tauri-apps/plugin-os';
import { defaultWindowIcon } from '@tauri-apps/api/app';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { Menu, type MenuOptions } from '@tauri-apps/api/menu';

import HomePage from './page/home';
import SplashPage from './page/splash';

import PageLayout from './layout/page';
import ModalLayout from './layout/modal';
import ToastLayout from './layout/toast';

import Theme from './utility/theme';
import Context from './utility/context';
import Language, { T } from './utility/language';

import { IsLogged } from './core/account';

import './style.css';

/**
 * Application - Root React application component that initializes platform integrations
 * and opens the initial page (home or splash)
 * @returns {JSX.Element} The root application component
 */
function Application()
{
    useEffect(() =>
    {
        if (platform() === 'windows')
        {
            const applyTrayUpdate = async() =>
            {
                const appIcon = await defaultWindowIcon();

                if (appIcon)
                {
                    const trayMenuOption: MenuOptions =
                    {
                        items:
                        [
                            {
                                id: 'open',
                                text: T('App.Tray.Open'),
                                action: () =>
                                {
                                    void getCurrentWindow().show();
                                }
                            },
                            {
                                id: 'quit',
                                text: T('App.Tray.Quit'),
                                action: () =>
                                {
                                    getCurrentWindow().close();
                                }
                            }
                        ]
                    };

                    const trayMenu = await Menu.new(trayMenuOption);

                    await TrayIcon.new({ menu: trayMenu, icon: appIcon, showMenuOnLeftClick: false });
                }
            };

            void applyTrayUpdate();
        }

        const applyPageUpdate = async() =>
        {
            if (await IsLogged())
            {
                Context.OpenPage(HomePage, { ID: 1 });
            }
            else
            {
                Context.OpenPage(SplashPage, { ID: 1 });
            }
        };

        void applyPageUpdate();
    }, [ ]);

    return <>

        <PageLayout />

        <ModalLayout />

        <ToastLayout />

    </>;
}

/**
 * Prevent certain keyboard shortcuts from triggering browser behavior
 */
document.addEventListener('keydown', (event) =>
{
    if (event.key === 'F3' || event.key === 'F5' || event.key === 'F7' || (event.ctrlKey && event.key === 'r'))
    {
        // event.preventDefault();
    }
});

document.addEventListener('contextmenu', (event) =>
{
    event.preventDefault();
});

const rootElement = document.querySelector('#root');

if (rootElement)
{
    await Theme.Initialize();

    await Language.Initialize();

    createRoot(rootElement).render(<Application />);
}

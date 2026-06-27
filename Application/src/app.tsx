import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { TrayIcon } from '@tauri-apps/api/tray';
import { platform } from '@tauri-apps/plugin-os';
import { defaultWindowIcon } from '@tauri-apps/api/app';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { Menu, type MenuOptions } from '@tauri-apps/api/menu';

import PageLayout from './layout/page';

import IntroPage from './page/intro';

import { openPage } from './utility/context';
import { T, initLanguage } from './utility/language';

import './style.css';

const applyWindowsTray = async() =>
{
    const appIcon = await defaultWindowIcon();

    if (appIcon)
    {
        const trayMenuOption: MenuOptions =
        {
            items: [
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
                        void getCurrentWindow().close();
                    }
                }
            ]
        };

        const trayMenu = await Menu.new(trayMenuOption);

        await TrayIcon.new({ tooltip: T('App.Name'), menu: trayMenu, icon: appIcon, showMenuOnLeftClick: false });
    }
};

/**
 * Root application.
 *
 * Responsibilities:
 * - Register global browser-event guards that should apply to the whole app.
 * - Open the first page so the UI has content as soon as the shell mounts.
 * @returns {JSX.Element} The root application component
 */
function Application()
{
    useEffect(() =>
    {
        openPage(IntroPage);
    }, [ ]);

    return (
        <>

            <PageLayout />

        </>
    );
}

/**
 * Prevent browser-default shortcuts and context menu actions that conflict with the desktop app experience.
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
    await initLanguage();

    if (platform() === 'windows')
    {
        await applyWindowsTray();
    }

    createRoot(rootElement).render(<Application />);
}

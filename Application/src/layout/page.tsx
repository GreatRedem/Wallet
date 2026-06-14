import type { JSX } from 'react';

import { useEffect, useState } from 'react';

import EventMap from '../utility/event';

/**
 * PageLayout - Hosts the global page stack.
 *
 * The layout listens to the shared event bus and renders every active page component in insertion order.
 *
 * @returns {JSX.Element | undefined} The page stack container, or `undefined` when empty.
 */
export default function PageLayout()
{
    const [ layoutMap, setLayoutMap ] = useState<JSX.Element[]>([ ]);

    useEffect(() =>
    {
        /**
         * OpenHandler - Appends a page component to the active stack.
         * @param {JSX.Element} Component - The page element to render.
         */
        const openHandler = (component: JSX.Element) =>
        {
            setLayoutMap((prev) => [ ...prev, component ]);
        };

        /**
         * CloseHandler - Removes a page component from the active stack.
         * @param {number} ID - The page identifier used as the React key.
         */
        const closeHandler = (id: number) =>
        {
            setLayoutMap((prev) => prev.filter((i) => i.key !== `${ id }`));
        };

        EventMap.On('Page.Open', openHandler);
        EventMap.On('Page.Close', closeHandler);

        return () =>
        {
            EventMap.Off('Page.Open', openHandler);
            EventMap.Off('Page.Close', closeHandler);
        };
    }, [ ]);

    if (layoutMap.length === 0)
    {
        return undefined;
    }

    return (
        <div className='relative h-screen w-screen overflow-hidden bg-base-1'>

            {
                layoutMap
            }

        </div>
    );
}

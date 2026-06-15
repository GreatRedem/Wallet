import type { ComponentType } from 'react';

import { emit } from './event';

/**
 * openPage - Emits a page-open event for the provided component.
 *
 * If `options.id` is provided, it is used as the React key. Otherwise, a
 * timestamp-based key is generated so the page can be tracked by the layout.
 *
 * @template T
 * @param {ComponentType<T>} Component - The page component to render.
 * @param {T} [props] - Props forwarded to the component.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const openPage = <T extends { id?: string }>(Component: ComponentType<T>, props?: T) =>
{
    const id = props && props.id !== undefined ? props.id : Date.now();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
    emit('Page.Open', <Component { ...(props ?? { } as T) } key={ id } />);
};

/**
 * closePage - Emits a page-close event for the given page ID.
 *
 * @param {number} id - The page instance identifier to close.
 */
export const closePage = (id: number) =>
{
    emit('Page.Close', id);
};

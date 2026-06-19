import type { ReactNode } from 'react';

type BackgroundType = 'normal' | 'transparent' | 'none';

interface BackgroundProps
{
    children: ReactNode;
    className?: string;
    type?: BackgroundType;
}

const getBackgroundClass = (type: BackgroundType) =>
{
    switch (type)
    {
        case 'normal':
        {
            return 'bg-[var(--background-normal)]';
        }
        case 'transparent':
        {
            return 'bg-[var(--background-transparent)]';
        }
        case 'none':
        {
            return '';
        }
        default:
        {
            return '';
        }
    }
};

export function Background({ children, type = 'none', className = '' }: BackgroundProps)
{
    return (
        <div className={ `${ getBackgroundClass(type) } ${ className }` }>

            {
                children
            }

        </div>
    );
}

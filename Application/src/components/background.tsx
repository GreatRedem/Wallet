import type { ReactNode } from 'react';

type BackgroundType = 'primary' | 'transparent';

interface BackgroundProps
{
    children: ReactNode;
    type?: BackgroundType;
    className?: string;
}

const getClass = (type: BackgroundType) =>
{
    switch (type)
    {
        case 'primary':
        {
            return 'bg-[var(--background-primary)]';
        }
        case 'transparent':
        {
            return 'bg-[var(--background-transparent)]';
        }
        default:
        {
            return '';
        }
    }
};

export function Background({ children, type = 'transparent', className = '' }: BackgroundProps)
{
    return (
        <div className={ `${ getClass(type) } ${ className }` }>

            {
                children
            }

        </div>
    );
}

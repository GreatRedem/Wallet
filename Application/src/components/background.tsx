import type { ReactNode } from 'react';

type BackgroundType = 'primary' | 'transparent';

interface BackgroundProps
{
    children: ReactNode;
    type?: BackgroundType;
    className?: string;
}

const getBackgroundColor = (type: BackgroundType) =>
{
    switch (type)
    {
        case 'primary':
        {
            return 'bg-background';
        }
        case 'transparent':
        {
            return 'bg-transparent';
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
        <div className={ `${ getBackgroundColor(type) } ${ className }` }>

            {
                children
            }

        </div>
    );
}

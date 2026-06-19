import type { HTMLAttributes, ReactNode } from 'react';

type TextSize = 'tiny' | 'small' | 'medium' | 'large' | 'xlarge';
type TextTone = 'default' | 'muted' | 'success' | 'warning' | 'danger';
type TextElement = 'span' | 'p' | 'div';

interface TextProps extends HTMLAttributes<HTMLElement>
{
    message?: ReactNode;
    children?: ReactNode;
    bold?: boolean;
    size?: TextSize;
    tone?: TextTone;
    as?: TextElement;
    className?: string;
}

const getSizeClass = (size: TextSize) =>
{
    switch (size)
    {
        case 'tiny':
        {
            return 'text-[length:var(--txt-size-tiny)]';
        }
        case 'small':
        {
            return 'text-[length:var(--txt-size-small)]';
        }
        case 'medium':
        {
            return 'text-[length:var(--txt-size-medium)]';
        }
        case 'large':
        {
            return 'text-[length:var(--txt-size-large)]';
        }
        case 'xlarge':
        {
            return 'text-[length:var(--txt-size-xlarge)]';
        }
        default:
        {
            return '';
        }
    }
};

const getToneClass = (tone: TextTone) =>
{
    switch (tone)
    {
        case 'muted':
        {
            return 'text-[var(--color-gray-500)]';
        }
        case 'success':
        {
            return 'text-emerald-600';
        }
        case 'warning':
        {
            return 'text-amber-600';
        }
        case 'danger':
        {
            return 'text-red-600';
        }
        case 'default':
        default:
        {
            return '';
        }
    }
};

export function Text({ message, children, bold = false, size = 'small', tone = 'default', as: Component = 'div', className = '', ...props }: TextProps)
{
    return (
        <Component
            className={ `${ getSizeClass(size) } ${ getToneClass(tone) } ${ bold ? 'font-semibold' : 'font-normal' } ${ className }` }
            {...props}>
            { message ?? children }
        </Component>
    );
}

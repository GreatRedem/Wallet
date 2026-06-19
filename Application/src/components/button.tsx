import type { ReactNode } from 'react';

type ButtonSize = 'small' | 'medium' | 'large';
type ButtonType = 'normal' | 'disabled';

interface ButtonProps
{
    message: ReactNode;
    size: ButtonSize;
    type?: ButtonType;
    startIcon?: ReactNode;
    endIcon?: ReactNode;
    className?: string;
}

const getButtonSize = (size: ButtonSize) =>
{
    switch (size)
    {
        case 'small':
        {
            return 'min-h-8 px-2.5 py-1.5 text-[length:var(--txt-size-small)] gap-1.5';
        }
        case 'medium':
        {
            return 'min-h-10 px-3 py-2 text-[length:var(--txt-size-medium)] gap-2';
        }
        case 'large':
        {
            return 'min-h-12 px-4 py-2.5 text-[length:var(--txt-size-large)] gap-2.5';
        }
        default:
        {
            return '';
        }
    }
};

const getButtonType = (type: ButtonType) =>
{
    switch (type)
    {
        case 'disabled':
        {
            return 'border border-[var(--button-disabled-border)] bg-[var(--button-disabled-bg)] text-[var(--color-gray-400)] cursor-not-allowed';
        }
        case 'normal':
        {
            return 'border border-[var(--button-normal-border)] bg-[var(--button-normal-bg)] cursor-pointer hover:border-[var(--button-normal-border-hover)] hover:bg-[var(--button-normal-bg-hover)] active:bg-[var(--button-normal-bg-active)]';
        }
        default:
        {
            return '';
        }
    }
};

export function Button({ message, size, startIcon, endIcon, type = 'normal', className = '' }: ButtonProps)
{
    return (
        <button
            type='button'
            className={ `inline-flex items-center justify-center rounded-(--button-radius) transition-colors ${ getButtonSize(size) } ${ getButtonType(type) } ${ className }` }
            disabled={ type === 'disabled' }>

            {
                startIcon
            }

            {
                message
            }

            {
                endIcon
            }

        </button>
    );
}

type ButtonIconSize = 'small' | 'medium' | 'large';
type ButtonIconType = 'normal' | 'disabled';

interface ButtonIconProps
{
    icon: ReactNode | string;
    size: ButtonIconSize;
    type?: ButtonIconType;
    className?: string;
}

const getButtonIconSize = (buttonSize: ButtonIconSize) =>
{
    switch (buttonSize)
    {
        case 'small':
        {
            return 'size-8';
        }
        case 'medium':
        {
            return 'size-10';
        }
        case 'large':
        {
            return 'size-12';
        }
        default:
        {
            return '';
        }
    }
};

const getButtonIconType = (buttonType: ButtonIconType) =>
{
    switch (buttonType)
    {
        case 'disabled':
        {
            return 'border border-[var(--button-disabled-border)] bg-[var(--button-disabled-bg)] cursor-not-allowed';
        }
        case 'normal':
        {
            return 'border border-[var(--button-normal-border)] bg-[var(--button-normal-bg)] cursor-pointer hover:border-[var(--button-normal-border-hover)] hover:bg-[var(--button-normal-bg-hover)] active:bg-[var(--button-normal-bg-active)]';
        }
        default:
        {
            return '';
        }
    }
};

export function ButtonIcon({ icon, size, type = 'normal', className = '' }: ButtonIconProps)
{
    return (
        <button
            type='button'
            className={ `rounded-(--button-radius) p-1 transition-colors ${ getButtonIconSize(size) } ${ getButtonIconType(type) } ${ className }` }
            disabled={ type === 'disabled' }>

            {
                icon
            }

        </button>
    );
}

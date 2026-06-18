type ButtonSize = 'small' | 'medium' | 'large';
type ButtonType = 'normal' | 'disabled';

interface ButtonProps
{
    icon: string;
    type?: ButtonType;
    size?: ButtonSize;
    className?: string;
    onClick?: () => void;
}

export function ButtonIcon({ icon, type = 'normal', size = 'medium', className = '', onClick }: ButtonProps)
{
    const getSize = (buttonSize: ButtonSize) =>
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

    const getClass = (buttonType: ButtonType) =>
    {
        switch (buttonType)
        {
            case 'disabled':
            {
                return `rounded-[var(--button-disabled-radius)] bg-[var(--button-disabled-bg)] border border-[var(--button-disabled-border)] cursor-not-allowed`;
            }
            case 'normal':
            {
                return `rounded-[var(--button-normal-radius)] bg-[var(--button-normal-bg)] border border-[var(--button-normal-border)] cursor-pointer hover:border-[var(--button-normal-border-hover)] hover:bg-[var(--button-normal-bg-hover)] active:bg-[var(--button-normal-bg-active)]`;
            }
            default:
            {
                return '';
            }
        }
    };

    return (
        <button
            className={ `p-1 transition-colors ${ getClass(type) } ${ getSize(size) } ${ className }` }
            disabled={ type === 'disabled' }
            onClick={ onClick }>

            <img src={ icon } className='size-full' />

        </button>
    );
};

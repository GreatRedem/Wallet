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
    const getSizeClass = (buttonSize: ButtonSize) =>
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

    return (
        <button
            className={ `border border-gray-300 p-1 ${ type === 'disabled' ? 'cursor-not-allowed opacity-50' : 'cursor-pointer' } ${ getSizeClass(size) } ${ className }` }
            disabled={ type === 'disabled' }
            onClick={ onClick }>

            <img src={ icon } className='size-full' />

        </button>
    );
};

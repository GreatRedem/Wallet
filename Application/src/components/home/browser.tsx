export default function BrowserNavigation()
{
    return (
        <div className='flex w-full flex-1'>

            <iframe
                className='h-full w-full border-0'
                referrerPolicy='no-referrer'
                sandbox='allow-scripts allow-forms allow-popups allow-modals allow-downloads allow-same-origin'
                src='https://tokenlottery.io/' />

        </div>);
}

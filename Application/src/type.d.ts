// Home Navigation
type NavigationMap = 'WALLET' | 'HOME' | 'BROWSER';

// Storage
type StorageKey = 'App.Language' | 'App.Theme' | 'App.Phrase' | 'App.Passcode';

// Phrase Word Count
type PhraseKey = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12';

// General
declare module 'swiper/css'
{
    const value: string;

    export default value;
}

declare module '*.css'
{
    const value: string;

    export default value;
}

declare module '*.png'
{
    const value: string;

    export default value;
}

declare module '*.jpg'
{
    const value: string;

    export default value;
}

declare module '*.svg'
{
    const value: string;

    export default value;
}

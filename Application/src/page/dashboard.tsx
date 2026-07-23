import { motion } from 'motion/react';

export default function DashboardPage({ mnemonic }: { mnemonic: string })
{
    console.log('mnemonic', mnemonic);

    return (
        <motion.div className='flex size-full flex-col bg-base-1 p-4'>
            Hiss
        </motion.div>
    );
}

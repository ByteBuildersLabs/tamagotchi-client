import { ReactNode, useEffect } from 'react';
import { MiniKit } from '@worldcoin/minikit-js';

interface MiniKitProviderProps {
    children: ReactNode;
}

export function MiniKitProvider({ children }: MiniKitProviderProps) {
    useEffect(() => {
        // Initialize MiniKit when component mounts
        try {
            MiniKit.install();
            console.log('🌍 MiniKit initialized for World App integration');
            
            // Log environment detection
            if (MiniKit.isInstalled()) {
                console.log('✅ Running inside World App');
            } else {
                console.log('🌐 Running in regular browser (World App not detected)');
            }
        } catch (error) {
            console.warn('⚠️ MiniKit initialization failed:', error);
        }
    }, []);

    return <>{children}</>;
}
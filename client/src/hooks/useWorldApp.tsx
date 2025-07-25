import { MiniKit } from '@worldcoin/minikit-js';

export interface WorldAppInfo {
    isInWorldApp: boolean;
    miniKit: typeof MiniKit | null;
    username?: string;
}

export function useWorldApp(): WorldAppInfo {
    const isInWorldApp = MiniKit.isInstalled();
    
    return {
        isInWorldApp,
        miniKit: isInWorldApp ? MiniKit : null,
        username: isInWorldApp ? MiniKit.user?.username : undefined,
    };
}
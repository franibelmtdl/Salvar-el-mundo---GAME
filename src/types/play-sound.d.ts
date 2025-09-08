declare module 'play-sound' {
    interface PlayerOptions {
        timeout?: number;
        players?: string[];
    }

    interface Player {
        play(file: string, callback?: (err: any) => void): void;
    }

    function playSound(options?: PlayerOptions): Player;
    export = playSound;
}


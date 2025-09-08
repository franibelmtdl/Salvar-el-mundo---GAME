import playSound from 'play-sound';
import * as path from 'path';
import * as fs from 'fs';

export class AudioManager {
    private player: any;
    private sounds: Map<string, string> = new Map();
    private audioEnabled: boolean = true;

    constructor() {
        try {
            // Configurar play-sound para Windows
            this.player = playSound({
                players: ['mplayer', 'mpv', 'vlc', 'afplay', 'wmplayer', 'cmdmp3']
            });
            this.loadSounds();
        } catch (error) {
            console.log('🔇 Audio no disponible, continuando sin sonidos...');
            this.audioEnabled = false;
        }
    }

    private loadSounds(): void {
        // Usar rutas absolutas que apunten a la carpeta src/sounds/
        // __dirname apunta a dist/engine/, necesitamos ir a src/sounds/
        const soundsDir = path.join(__dirname, '..', '..', 'src', 'sounds');
        
        // Sonidos originales (MP3)
        this.sounds.set('attack', path.join(soundsDir, 'attack.mp3'));
        this.sounds.set('roar', path.join(soundsDir, 'roar.mp3'));
        this.sounds.set('rocket', path.join(soundsDir, 'rocket.mp3'));
        this.sounds.set('alert', path.join(soundsDir, 'alert.mp3'));
        this.sounds.set('victory', path.join(soundsDir, 'victory.mp3'));
        
        // Nuevos sonidos (WAV)
        this.sounds.set('thruster', path.join(soundsDir, 'thruster.wav'));
        this.sounds.set('launch', path.join(soundsDir, 'launch.wav'));
        this.sounds.set('defeat', path.join(soundsDir, 'defeat.wav'));
        this.sounds.set('beep', path.join(soundsDir, 'beep.wav'));
        this.sounds.set('countdown', path.join(soundsDir, 'countdown.wav'));
        
        // Nota: stealth.mp3 no disponible - se usará solo retroalimentación visual
        // this.sounds.set('stealth', path.join(soundsDir, 'stealth.mp3'));
    }

    public playSound(soundName: string): void {
        if (!this.audioEnabled) {
            this.showVisualFeedback(soundName);
            return;
        }

        const soundPath = this.sounds.get(soundName);
        if (!soundPath) {
            console.log(`⚠️  Sonido '${soundName}' no configurado`);
            this.showVisualFeedback(soundName);
            return;
        }

        // Verificar si el archivo existe
        if (!fs.existsSync(soundPath)) {
            console.log(`⚠️  Archivo de sonido no encontrado: ${path.basename(soundPath)}`);
            this.showVisualFeedback(soundName);
            return;
        }

        try {
            this.player.play(soundPath, (err: any) => {
                if (err) {
                    console.log(`🔇 Audio indisponible (${err.code || 'error'}). Usando modo visual.`);
                    this.showVisualFeedback(soundName);
                }
            });
        } catch (error) {
            console.log('🔇 Reproductor de audio no disponible. Usando modo visual.');
            this.showVisualFeedback(soundName);
        }
    }

    private showVisualFeedback(soundName: string): void {
        switch (soundName) {
            case 'attack':
                console.log('🔊 *SONIDO DE ATAQUE* ⚔️');
                break;
            case 'roar':
                console.log('🔊 *RUGIDO DE GODZILLA* 🦖');
                break;
            case 'rocket':
                console.log('🔊 *SONIDO DE COHETE* 🚀');
                break;
            case 'thruster':
                console.log('🔊 *ENCENDIDO DE PROPULSORES* 🔥');
                break;
            case 'launch':
                console.log('🔊 *MECANISMO DE DESPEGUE* 🛸');
                break;
            case 'victory':
                console.log('🔊 *ESCAPE EXITOSO* 🎉');
                break;
            case 'defeat':
                console.log('🔊 *DERROTA - SUPER CHARGE* 💥');
                break;
            case 'stealth':
                console.log('🔊 *VELO DE INVISIBILIDAD ACTIVADO* 👻');
                break;
            case 'alert':
                console.log('🔊 *ALERTA DEL SISTEMA* ⚠️');
                break;
            case 'beep':
                console.log('🔊 *BEEP DE CÓDIGO* 📱');
                break;
            case 'countdown':
                console.log('🔊 *CUENTA REGRESIVA* ⏰');
                break;
            default:
                console.log(`🔊 *SONIDO: ${soundName.toUpperCase()}* 🎵`);
                break;
        }
    }

    // Métodos públicos para sonidos específicos
    public playAttack(): void {
        this.playSound('attack');
    }

    public playRoar(): void {
        this.playSound('roar');
    }

    public playRocket(): void {
        this.playSound('rocket');
    }

    public playThruster(): void {
        this.playSound('thruster');
    }

    public playLaunch(): void {
        this.playSound('launch');
    }

    public playVictory(): void {
        this.playSound('victory');
    }

    public playDefeat(): void {
        this.playSound('defeat');
    }

    public playStealth(): void {
        this.playSound('stealth');
    }

    public playAlert(): void {
        this.playSound('alert');
    }

    public playBeep(): void {
        this.playSound('beep');
    }

    public playCountdown(): void {
        this.playSound('countdown');
    }

    public toggleAudio(): void {
        this.audioEnabled = !this.audioEnabled;
        console.log(`Audio ${this.audioEnabled ? 'activado' : 'desactivado'}`);
    }

    public diagnoseAudioSystem(): void {
        console.log('🔍 DIAGNÓSTICO DEL SISTEMA DE AUDIO:');
        console.log(`   Estado del sistema: ${this.audioEnabled ? '✅ Habilitado' : '❌ Deshabilitado'}`);
        console.log(`   Reproductor: ${this.player ? '✅ Configurado' : '❌ No disponible'}`);
        console.log(`   Sonidos registrados: ${this.sounds.size}`);
        
        console.log('\n📂 ARCHIVOS DE SONIDO:');
        this.sounds.forEach((filePath, soundName) => {
            const exists = fs.existsSync(filePath);
            const status = exists ? '✅' : '❌';
            const fileName = path.basename(filePath);
            console.log(`   ${status} ${soundName}: ${fileName}`);
        });
        
        if (!this.audioEnabled || this.sounds.size === 0) {
            console.log('\n💡 SOLUCIONES:');
            console.log('   1. Asegúrate de tener un reproductor de audio instalado (VLC, Windows Media Player)');
            console.log('   2. Verifica que los archivos de audio estén en la carpeta src/sounds/');
            console.log('   3. El juego funciona perfectamente con retroalimentación visual');
        }
    }
}

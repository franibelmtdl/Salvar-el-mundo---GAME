import { Scene } from './engine/scenes';
import { AudioManager } from './engine/audio';
import { MainMenuScene } from './engine/scenes';
import chalk from 'chalk';

export class Game {
    private currentScene: Scene | null = null;
    private audioManager: AudioManager;
    private isRunning: boolean = false;

    constructor() {
        this.audioManager = new AudioManager();
    }

    public async start(): Promise<void> {
        this.isRunning = true;
        this.displayGameIntro();
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        this.currentScene = new MainMenuScene(this.audioManager);
        await this.gameLoop();
    }

    private displayGameIntro(): void {
        console.clear();
        console.log(chalk.red.bold('╔═══════════════════════════════════════════════════════════════╗'));
        console.log(chalk.red.bold('║                  🚀 SALVAR AL MUNDO 🚀                      ║'));
        console.log(chalk.red.bold('║                                                               ║'));
        console.log(chalk.red.bold('║          Soldados, la humanidad está al borde                ║'));
        console.log(chalk.red.bold('║              de la destrucción.                              ║'));
        console.log(chalk.red.bold('║                                                               ║'));
        console.log(chalk.red.bold('║     🦖 Godzilla ha despertado y amenaza con                 ║'));
        console.log(chalk.red.bold('║           destruirlo todo.                                   ║'));
        console.log(chalk.red.bold('║                                                               ║'));
        console.log(chalk.red.bold('║    🛸 Tú y tu equipo deben programar la nave                ║'));
        console.log(chalk.red.bold('║        que puede salvar a la humanidad.                     ║'));
        console.log(chalk.red.bold('║                                                               ║'));
        console.log(chalk.red.bold('║    🤖 Contarán con el apoyo de una IA aliada,              ║'));
        console.log(chalk.red.bold('║       pero la decisión final es suya.                       ║'));
        console.log(chalk.red.bold('║                                                               ║'));
        console.log(chalk.red.bold('║        🌍 El destino del mundo está en sus manos.          ║'));
        console.log(chalk.red.bold('║                                                               ║'));
        console.log(chalk.red.bold('║                    ¡Buena suerte, soldados!                 ║'));
        console.log(chalk.red.bold('╚═══════════════════════════════════════════════════════════════╝'));
        console.log();
        console.log(chalk.yellow('🎮 Cargando sistema de escape...'));
    }

    private async gameLoop(): Promise<void> {
        while (this.isRunning && this.currentScene) {
            try {
                await this.currentScene.render();
                const nextScene = await this.currentScene.handleInput(null);
                
                if (nextScene === null) {
                    this.isRunning = false;
                    this.displayGameEnd();
                    break;
                }
                
                this.currentScene = nextScene;
            } catch (error) {
                console.error(chalk.red('💥 Error crítico en el sistema:'), error);
                console.log(chalk.yellow('🔧 Reiniciando sistemas de emergencia...'));
                
                // Reiniciar al menú principal en caso de error
                this.currentScene = new MainMenuScene(this.audioManager);
            }
        }
    }

    private displayGameEnd(): void {
        console.log(chalk.cyan('\n════════════════════════════════════════════════════════════'));
        console.log(chalk.cyan('                    FIN DE LA MISIÓN                       '));
        console.log(chalk.cyan('════════════════════════════════════════════════════════════'));
        console.log(chalk.yellow('🎮 Gracias por jugar "Salvar al Mundo"'));
        console.log(chalk.blue('🌟 Desarrollado con TypeScript + Node.js'));
        console.log(chalk.gray('📱 Sistema de audio: play-sound'));
        console.log(chalk.gray('🎨 Interfaz: chalk + inquirer'));
        console.log(chalk.magenta('\n👨‍💻 ¡Hasta la próxima misión, soldado!'));
        console.log();
    }

    public stop(): void {
        this.isRunning = false;
    }
}


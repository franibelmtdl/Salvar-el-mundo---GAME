import * as figlet from 'figlet';
import chalk from 'chalk';
import { Game } from './game';

async function main() {
    try {
        // Mostrar título del juego
        console.clear();
        console.log(chalk.cyan.bold(figlet.textSync('SALVAR AL MUNDO', {
            font: 'ANSI Shadow',
            horizontalLayout: 'default',
            verticalLayout: 'default'
        })));
        
        console.log(chalk.yellow.bold('🎮 Un juego de aventura épica en la terminal'));
        console.log(chalk.gray('Desarrollado con TypeScript y Node.js'));
        console.log();
        
        // Esperar un momento para que el usuario vea el título
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Iniciar el juego
        const game = new Game();
        await game.start();
        
    } catch (error) {
        console.error(chalk.red('Error fatal del juego:'), error);
        process.exit(1);
    }
}

// Manejar señales de terminación
process.on('SIGINT', () => {
    console.log(chalk.yellow('\n\n👋 ¡Hasta luego!'));
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log(chalk.yellow('\n\n👋 ¡Hasta luego!'));
    process.exit(0);
});

// Iniciar la aplicación
main().catch((error) => {
    console.error(chalk.red('Error no manejado:'), error);
    process.exit(1);
});

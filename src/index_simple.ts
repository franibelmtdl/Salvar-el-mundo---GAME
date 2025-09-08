import { JuegoSalvarMundo } from './game_simple';

async function main() {
    console.log('Cargando juego...');
    
    try {
        const juego = new JuegoSalvarMundo();
        await juego.iniciar();
    } catch (error) {
        console.log('Error:', error);
    }
}

main();

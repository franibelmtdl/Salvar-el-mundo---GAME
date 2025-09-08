import inquirer from 'inquirer';
import chalk from 'chalk';
import figlet from 'figlet';
import { PropulsorBasico } from './logic/propulsores_simple';
import { CalcularDistancia } from './logic/distancia_simple';
import { GeneradorCodigo } from './logic/codigo_seguridad';
import { AudioManager } from './engine/audio';
import { AIHelper } from './engine/aiHelper';
import { GodzillaEnemigo } from './logic/godzilla_simple';

export class JuegoSalvarMundo {
    propulsores: PropulsorBasico;
    calculadora: CalcularDistancia;
    generador: GeneradorCodigo;
    audio: AudioManager;
    
    constructor() {
        this.propulsores = new PropulsorBasico();
        this.calculadora = new CalcularDistancia();
        this.generador = new GeneradorCodigo();
        this.audio = new AudioManager();
    }

    async mostrarMenu() {
        console.clear();
        
        const titulo = figlet.textSync('SALVAR AL MUNDO', {
            font: 'Standard',
            horizontalLayout: 'default',
            verticalLayout: 'default'
        });
        
        console.log(chalk.red(titulo));
        console.log('');
        console.log(chalk.yellow('Godzilla ha despertado!'));
        console.log(chalk.white('Debes programar la nave para escapar'));
        console.log('');

        const respuesta = await inquirer.prompt([
            {
                type: 'list',
                name: 'opcion',
                message: 'Que quieres hacer?',
                choices: [
                    'Empezar mision',
                    'Ver instrucciones',
                    'Pedir consejo a la IA',
                    'Salir'
                ]
            }
        ]);

        if (respuesta.opcion == 'Empezar mision') {
            await this.empezarJuego();
        } else if (respuesta.opcion == 'Ver instrucciones') {
            await this.mostrarInstrucciones();
        } else if (respuesta.opcion == 'Pedir consejo a la IA') {
            await AIHelper.giveAdvice('escape_route');
            await this.mostrarMenu();
        } else {
            console.log('Adios!');
            return;
        }
    }

    async mostrarInstrucciones() {
        console.clear();
        
        const instrucciones = figlet.textSync('INSTRUCCIONES', {
            font: 'Small',
            horizontalLayout: 'default'
        });
        
        console.log(chalk.cyan(instrucciones));
        console.log('');
        console.log(chalk.yellow('PASOS PARA SALVAR AL MUNDO:'));
        console.log('');
        console.log(chalk.green('1.') + ' Verificar propulsores');
        console.log(chalk.green('2.') + ' Calcular potencia necesaria');
        console.log(chalk.green('3.') + ' Medir distancia a Godzilla');
        console.log(chalk.green('4.') + ' Generar codigo de seguridad');
        console.log(chalk.green('5.') + ' Despegar y escapar!');
        console.log('');
        
        await inquirer.prompt([{
            type: 'input',
            name: 'continuar',
            message: 'Presiona Enter para volver...'
        }]);
        
        await this.mostrarMenu();
    }

    async empezarJuego() {
        console.clear();
        
        const mision = figlet.textSync('MISION INICIADA', {
            font: 'Small',
            horizontalLayout: 'default'
        });
        
        console.log(chalk.cyan(mision));
        console.log('');
        
        const propulsorIzq = await inquirer.prompt([{
            type: 'confirm',
            name: 'funciona',
            message: 'El propulsor IZQUIERDO funciona?'
        }]);

        const propulsorDer = await inquirer.prompt([{
            type: 'confirm', 
            name: 'funciona',
            message: 'El propulsor DERECHO funciona?'
        }]);

        let izquierdo = propulsorIzq.funciona;
        let derecho = propulsorDer.funciona;

        console.log('');
        console.log(chalk.yellow('ESTADO DE PROPULSORES:'));
        console.log(chalk.green('Izquierdo:'), izquierdo ? chalk.green('✅ OK') : chalk.red('❌ ROTO'));
        console.log(chalk.green('Derecho:'), derecho ? chalk.green('✅ OK') : chalk.red('❌ ROTO'));

        if (!izquierdo && !derecho) {
            console.log('');
            const gameOver = figlet.textSync('GAME OVER', {
                font: 'Standard',
                horizontalLayout: 'default'
            });
            
            console.log(chalk.red('AMBOS PROPULSORES ROTOS!'));
            console.log(chalk.red('Godzilla activa SUPER CHARGE!'));
            this.audio.playRoar();
            
            let godzilla = new GodzillaEnemigo();
            godzilla.activarSuperCharge();
            
            console.log('');
            console.log(chalk.red('ATAQUES DE GODZILLA CON SUPER CHARGE:'));
            for (let i = 0; i < godzilla.ataques.length; i++) {
                console.log(chalk.red(`${i + 1}. ${godzilla.ataques[i].nombre}: ${godzilla.ataques[i].poder} poder`));
            }
            
            let ataqueUsado = godzilla.atacar();
            console.log('');
            console.log(chalk.red(`Godzilla usa ${ataqueUsado.nombre}!`));
            this.audio.playAttack();
            this.audio.playDefeat();
            console.log('');
            console.log(chalk.red(gameOver));
            return;
        }

        let umbral = this.propulsores.verificarPropulsores(izquierdo, derecho);
        console.log('');
        console.log(chalk.yellow('Potencia necesaria:'), chalk.cyan(umbral + '%'));

        const preguntarIA = await inquirer.prompt([{
            type: 'confirm',
            name: 'quiere',
            message: 'Quieres pedir consejo a la IA antes de asignar potencia?'
        }]);

        if (preguntarIA.quiere) {
            await AIHelper.giveAdvice('power_allocation', { currentPower: umbral });
        }

        const potencia = await inquirer.prompt([{
            type: 'number',
            name: 'valor',
            message: 'Que porcentaje de potencia usar? (0-100)'
        }]);

        let puedesDespegar = this.propulsores.puedesDespegar(izquierdo, derecho, potencia.valor);

        if (!puedesDespegar) {
            console.log('');
            const fallo = figlet.textSync('FALLO CRITICO', {
                font: 'Small',
                horizontalLayout: 'default'
            });
            
            console.log(chalk.red(fallo));
            console.log(chalk.red('POTENCIA INSUFICIENTE!'));
            console.log(chalk.red('No puedes despegar'));
            this.audio.playAlert();
            console.log(chalk.red('GAME OVER'));
            return;
        }

        const exito = figlet.textSync('AUTORIZADO', {
            font: 'Small',
            horizontalLayout: 'default'
        });

        console.log('');
        console.log(chalk.green(exito));
        console.log(chalk.green('POTENCIA SUFICIENTE!'));
        this.audio.playThruster();
        console.log(chalk.cyan('Continuando...'));

        await this.calcularDistanciaGodzilla();
        
        await this.generarCodigoSeguridad();
        
        await this.secuenciaDespegue();
    }

    async calcularDistanciaGodzilla() {
        console.log('');
        
        const tituloDistancia = figlet.textSync('DISTANCIA', {
            font: 'Small',
            horizontalLayout: 'default'
        });
        
        console.log(chalk.yellow(tituloDistancia));
        console.log(chalk.white('Necesitas coordenadas entre 50 y 1000, todas diferentes'));

        let coordenadasValidas = false;
        let x1, y1, x2, y2;

        while (!coordenadasValidas) {
            const coords = await inquirer.prompt([
                { type: 'number', name: 'x1', message: 'Coordenada X1:' },
                { type: 'number', name: 'y1', message: 'Coordenada Y1:' },
                { type: 'number', name: 'x2', message: 'Coordenada X2:' },
                { type: 'number', name: 'y2', message: 'Coordenada Y2:' }
            ]);

            if (this.calculadora.validarNumeros(coords.x1, coords.y1, coords.x2, coords.y2)) {
                x1 = coords.x1;
                y1 = coords.y1; 
                x2 = coords.x2;
                y2 = coords.y2;
                coordenadasValidas = true;
            } else {
                console.log(chalk.red('Coordenadas invalidas! Intenta de nuevo'));
            }
        }

        let distanciaCalculada = this.calculadora.calcularDistancia(x1, y1, x2, y2);
        console.log('');
        console.log(chalk.cyan('Distancia calculada:'), chalk.green(distanciaCalculada.toFixed(2)), chalk.cyan('metros'));

        if (this.calculadora.estasMuyCerca(distanciaCalculada)) {
            console.log(chalk.yellow('DEMASIADO CERCA! Modo invisible activado'));
            this.audio.playStealth();
            console.log('Simulando reposicionamiento...');
            await new Promise(resolve => setTimeout(resolve, 2000));
            console.log(chalk.green('Distancia segura alcanzada!'));
        } else {
            console.log(chalk.green('Distancia segura!'));
        }
    }

    async generarCodigoSeguridad() {
        console.log('');
        console.log(chalk.cyan('GENERANDO CODIGO DE SEGURIDAD...'));
        this.audio.playBeep();
        
        let codigo = this.generador.generarCodigo();
        
        console.log('');
        console.log('CODIGO GENERADO:');
        for (let i = 0; i < codigo.length; i++) {
            console.log((i + 1) + '. ' + codigo[i]);
        }
        
        let esValido = this.generador.verificarCodigo(codigo);
        if (esValido) {
            console.log('');
            console.log(chalk.green('Codigo valido!'));
        } else {
            console.log('');
            console.log(chalk.red('Error en el codigo'));
        }
    }

    async secuenciaDespegue() {
        console.log('');
        
        const despegue = figlet.textSync('DESPEGUE', {
            font: 'Standard',
            horizontalLayout: 'default'
        });
        
        console.log(chalk.green(despegue));
        console.log(chalk.yellow('Duracion: 2 minutos simulados (24 segundos reales)'));
        console.log('');
        
        this.audio.playLaunch();
        this.audio.playCountdown();

        for (let i = 0; i <= 100; i += 10) {
            let barra = '';
            for (let j = 0; j < 10; j++) {
                if (j < i / 10) {
                    barra += '█';
                } else {
                    barra += '░';
                }
            }
            
            console.log(`[${barra}] ${i}%`);
            
            if (i == 30) {
                console.log('   Encendiendo propulsores...');
                this.audio.playRocket();
            }
            if (i == 60) {
                console.log('   Separando de plataforma...');
                this.audio.playThruster();
            }
            if (i == 90) {
                console.log('   Saliendo de atmosfera...');
            }
            
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        const victoria = figlet.textSync('VICTORIA', {
            font: 'Standard',
            horizontalLayout: 'default'
        });

        console.log('');
        console.log(chalk.green(victoria));
        console.log(chalk.cyan('HAS SALVADO A LA HUMANIDAD!'));
        this.audio.playVictory();
        console.log('');
        console.log(chalk.magenta('Gracias por jugar!'));
    }

    async iniciar() {
        await this.mostrarMenu();
    }
}

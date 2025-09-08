import inquirer from 'inquirer';
import chalk from 'chalk';
import { AudioManager } from './audio';
import { AIHelper, GameSituation } from './aiHelper';
import { PropulsorSystem, PropulsorState, SystemPower } from '../logic/propulsores';
import { DistanceCalculator, Coordinates } from '../logic/distancia';
import { SecurityCodeGenerator } from '../logic/seguridad';
import { LaunchSequence } from '../logic/despegue';
import { GodzillaEnemy } from '../logic/godzilla';

export abstract class Scene {
    protected audioManager: AudioManager;
    
    constructor(audioManager: AudioManager) {
        this.audioManager = audioManager;
    }
    
    abstract render(): Promise<void>;
    abstract handleInput(input: any): Promise<Scene | null>;
}

export class MainMenuScene extends Scene {
    async render(): Promise<void> {
        console.clear();
        this.displayTitle();
        this.displayMission();
    }

    private displayTitle(): void {
        console.log(chalk.red.bold('╔══════════════════════════════════════════════════════════╗'));
        console.log(chalk.red.bold('║              🦖 SALVAR AL MUNDO 🦖                     ║'));
        console.log(chalk.red.bold('║                                                          ║'));
        console.log(chalk.red.bold('║           GODZILLA HA DESPERTADO                        ║'));
        console.log(chalk.red.bold('╚══════════════════════════════════════════════════════════╝'));
        console.log();
    }

    private displayMission(): void {
        console.log(chalk.yellow('🎯 MISIÓN:'));
        console.log(chalk.white('La humanidad está al borde de la destrucción.'));
        console.log(chalk.white('Godzilla amenaza con destruirlo todo.'));
        console.log(chalk.white('Tú y tu equipo deben programar la nave que puede salvar a la humanidad.'));
        console.log();
        console.log(chalk.cyan('🤖 Contarás con el apoyo de una IA aliada que te dará consejos estratégicos.'));
        console.log(chalk.red('⚠️  Pero la decisión final es TUYA.'));
        console.log();
        console.log(chalk.magenta('🌍 El destino del mundo está en tus manos, soldado.'));
        console.log();
    }

    async handleInput(input: any): Promise<Scene | null> {
        const { action } = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: '¿Qué deseas hacer, soldado?',
                choices: [
                    { name: '🚀 Iniciar Misión de Escape', value: 'start' },
                    { name: '📖 Ver Manual de Operaciones', value: 'instructions' },
                    { name: '🚪 Salir (Abandonar misión)', value: 'exit' }
                ]
            }
        ]);

        switch (action) {
            case 'start':
                return new PropulsorCheckScene(this.audioManager);
            case 'instructions':
                return new InstructionsScene(this.audioManager);
            case 'exit':
                console.log(chalk.red('💀 Has abandonado la misión. La humanidad está condenada...'));
                return null;
            default:
                return this;
        }
    }
}

export class InstructionsScene extends Scene {
    async render(): Promise<void> {
        console.clear();
        console.log(chalk.cyan.bold('📖 MANUAL DE OPERACIONES - ESCAPE DE GODZILLA'));
        console.log();
        console.log(chalk.yellow('🎯 OBJETIVO PRINCIPAL:'));
        console.log('   Escapar de "The Killer" (Godzilla) usando la nave espacial de emergencia.');
        console.log();
        console.log(chalk.yellow('🚀 SISTEMAS DE LA NAVE:'));
        console.log('   • Dos propulsores: izquierdo y derecho');
        console.log('   • Sistema de potencia con hidroPropulsor (5000) + potencia (10000)');
        console.log('   • Umbral de despegue: 75% (ambos funcionales) o 90% (uno solo)');
        console.log();
        console.log(chalk.yellow('📐 CÁLCULOS CRÍTICOS:'));
        console.log('   • Distancia a Godzilla usando fórmula de Pitágoras');
        console.log('   • Velo de invisibilidad activo cuando distancia < 300m');
        console.log('   • Código de seguridad con números aleatorios (n % 50 = 1)');
        console.log();
        console.log(chalk.yellow('⚠️  SITUACIONES DE EMERGENCIA:'));
        console.log('   • Si ambos propulsores fallan → Godzilla activa Super Charge (x10 poder)');
        console.log('   • Múltiples finales dependiendo de tus decisiones');
        console.log();
        console.log(chalk.yellow('🤖 IA ALIADA:'));
        console.log('   • Disponible para consejos estratégicos en cualquier momento');
        console.log('   • La decisión final siempre es tuya');
        console.log();
    }

    async handleInput(input: any): Promise<Scene | null> {
        await inquirer.prompt([
            {
                type: 'input',
                name: 'continue',
                message: 'Presiona Enter para volver al menú principal...'
            }
        ]);
        return new MainMenuScene(this.audioManager);
    }
}

export class PropulsorCheckScene extends Scene {
    private propulsorSystem: PropulsorSystem;
    private systemPower: SystemPower;

    constructor(audioManager: AudioManager) {
        super(audioManager);
        this.propulsorSystem = new PropulsorSystem();
        this.systemPower = this.propulsorSystem.getInitialSystemPower();
    }

    async render(): Promise<void> {
        console.clear();
        console.log(chalk.cyan.bold('🔧 VERIFICACIÓN DEL SISTEMA DE PROPULSORES'));
        console.log('═══════════════════════════════════════════════════════');
        console.log();
        console.log(chalk.yellow('⚡ ESTADO DEL SISTEMA:'));
        console.log(`   HidroPropulsor: ${this.systemPower.hidroPropulsor}`);
        console.log(`   Potencia: ${this.systemPower.potencia}`);
        console.log(`   Poder Base: ${this.systemPower.poderBase}`);
        console.log();
        console.log(chalk.yellow('🔧 Es necesario verificar el estado de cada propulsor antes de continuar.'));
        console.log();
    }

    async handleInput(input: any): Promise<Scene | null> {
        const choices = [
            { name: '🔧 Verificar estado de propulsores', value: 'check' },
            { name: '🤖 Pedir consejo a la IA', value: 'advice' },
            { name: '🔙 Volver al menú principal', value: 'back' }
        ];

        const { action } = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: '¿Qué acción deseas realizar?',
                choices
            }
        ]);

        switch (action) {
            case 'check':
                return await this.checkPropulsors();
            case 'advice':
                await AIHelper.giveAdvice('propulsor_check');
                return this;
            case 'back':
                return new MainMenuScene(this.audioManager);
            default:
                return this;
        }
    }

    private async checkPropulsors(): Promise<Scene> {
        console.log(chalk.yellow('\n🔧 Verificando estado de los propulsores...'));
        
        // Simular verificación
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const { leftEngine } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'leftEngine',
                message: '¿El propulsor IZQUIERDO está en buenas condiciones?',
                default: true
            }
        ]);

        const { rightEngine } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'rightEngine',
                message: '¿El propulsor DERECHO está en buenas condiciones?',
                default: true
            }
        ]);

        const propulsorState: PropulsorState = {
            izquierdo: leftEngine,
            derecho: rightEngine
        };

        this.displayPropulsorStatus(propulsorState);
        
        return new PowerCalculationScene(this.audioManager, propulsorState, this.systemPower);
    }

    private displayPropulsorStatus(state: PropulsorState): void {
        console.log(chalk.cyan('\n📊 ESTADO DE LOS PROPULSORES:'));
        console.log(`   Propulsor Izquierdo: ${state.izquierdo ? chalk.green('✅ OPERATIVO') : chalk.red('❌ AVERIADO')}`);
        console.log(`   Propulsor Derecho: ${state.derecho ? chalk.green('✅ OPERATIVO') : chalk.red('❌ AVERIADO')}`);
        
        const threshold = this.propulsorSystem.calculateTakeoffThreshold(state);
        console.log(`   Umbral de despegue requerido: ${threshold}%`);
        
        if (!state.izquierdo && !state.derecho) {
            console.log(chalk.red('\n🚨 ¡ALERTA CRÍTICA! Ningún propulsor funciona.'));
        }
    }
}

export class PowerCalculationScene extends Scene {
    private propulsorSystem: PropulsorSystem;
    private propulsorState: PropulsorState;
    private systemPower: SystemPower;

    constructor(audioManager: AudioManager, propulsorState: PropulsorState, systemPower: SystemPower) {
        super(audioManager);
        this.propulsorSystem = new PropulsorSystem();
        this.propulsorState = propulsorState;
        this.systemPower = systemPower;
    }

    async render(): Promise<void> {
        console.clear();
        console.log(chalk.cyan.bold('⚡ CÁLCULO DE POTENCIA Y AUTORIZACIÓN DE DESPEGUE'));
        console.log('═════════════════════════════════════════════════════════════');
        console.log();
        this.displaySystemStatus();
    }

    private displaySystemStatus(): void {
        const threshold = this.propulsorSystem.calculateTakeoffThreshold(this.propulsorState);
        const specialReqs = this.propulsorSystem.calculateSpecialRequirements(this.propulsorState, this.systemPower);
        
        console.log(chalk.yellow('📊 ANÁLISIS DEL SISTEMA:'));
        console.log(`   Poder Base Total: ${this.systemPower.poderBase}`);
        console.log(`   Umbral requerido: ${threshold}%`);
        
        if (Object.keys(specialReqs).length > 0) {
            console.log('\n🔧 REQUISITOS ESPECIALES (Solo un propulsor funcional):');
            if (specialReqs.requeridoDerecho) {
                console.log(`   Requerido Derecho: ${specialReqs.requeridoDerecho.toFixed(2)}`);
            }
            if (specialReqs.requeridoIzquierdo) {
                console.log(`   Requerido Izquierdo: ${specialReqs.requeridoIzquierdo.toFixed(2)}`);
            }
        }
        console.log();
    }

    async handleInput(input: any): Promise<Scene | null> {
        // Si ningún propulsor funciona, ir directamente al combate
        if (!this.propulsorState.izquierdo && !this.propulsorState.derecho) {
            console.log(chalk.red('🚨 FALLO TOTAL DEL SISTEMA DE PROPULSORES'));
            console.log(chalk.red('🦖 Godzilla detecta nuestra ubicación...'));
            this.audioManager.playRoar();
            await new Promise(resolve => setTimeout(resolve, 3000));
            return new CombatScene(this.audioManager, true); // Super Charge activado
        }

        const { powerPercentage } = await inquirer.prompt([
            {
                type: 'number',
                name: 'powerPercentage',
                message: '¿Qué porcentaje de potencia quieres asignar? (0-100):',
                validate: (input: number) => {
                    if (input < 0 || input > 100) {
                        return 'Debe ser un valor entre 0 y 100';
                    }
                    return true;
                }
            }
        ]);

        const result = this.propulsorSystem.checkTakeoffAuthorization(
            this.propulsorState, 
            this.systemPower, 
            powerPercentage
        );

        console.log('\n' + chalk.cyan('📋 RESULTADO DE LA VERIFICACIÓN:'));
        console.log(result.message);
        
        if (result.details.superChargeActivated) {
            console.log(chalk.red('\n🦖 Godzilla ha detectado nuestro fallo...'));
            this.audioManager.playRoar();
            await new Promise(resolve => setTimeout(resolve, 3000));
            return new CombatScene(this.audioManager, true);
        }

        if (result.authorized) {
            console.log(chalk.green('\n✅ ¡Autorización de despegue concedida!'));
            this.audioManager.playThruster();
            await new Promise(resolve => setTimeout(resolve, 2000));
            return new DistanceCalculationScene(this.audioManager);
        } else {
            console.log(chalk.yellow('\n⚠️ Potencia insuficiente. Puedes intentar de nuevo o pedir consejo.'));
            
            const { nextAction } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'nextAction',
                    message: '¿Qué deseas hacer?',
                    choices: [
                        { name: '🔄 Intentar con diferente potencia', value: 'retry' },
                        { name: '🤖 Pedir consejo a la IA', value: 'advice' },
                        { name: '⚔️ Prepararse para combate', value: 'combat' }
                    ]
                }
            ]);

            switch (nextAction) {
                case 'retry':
                    return this;
                case 'advice':
                    await AIHelper.giveAdvice('power_allocation', { currentPower: powerPercentage });
                    return this;
                case 'combat':
                    return new CombatScene(this.audioManager, false);
                default:
                    return this;
            }
        }
    }
}

export class DistanceCalculationScene extends Scene {
    private distanceCalculator: DistanceCalculator;

    constructor(audioManager: AudioManager) {
        super(audioManager);
        this.distanceCalculator = new DistanceCalculator();
    }

    async render(): Promise<void> {
        console.clear();
        console.log(chalk.cyan.bold('📐 CÁLCULO DE DISTANCIA A "THE KILLER"'));
        console.log('═══════════════════════════════════════════════════════');
        console.log();
        console.log(chalk.yellow('🎯 Necesitamos calcular la distancia exacta a Godzilla'));
        console.log(chalk.white('   Ingresa las coordenadas (valores entre 50 y 1000, todos diferentes):'));
        console.log();
    }

    async handleInput(input: any): Promise<Scene | null> {
        const { action } = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: '¿Qué deseas hacer?',
                choices: [
                    { name: '📐 Calcular distancia a Godzilla', value: 'calculate' },
                    { name: '🤖 Pedir consejo a la IA', value: 'advice' },
                    { name: '🔙 Volver a verificación de potencia', value: 'back' }
                ]
            }
        ]);

        switch (action) {
            case 'calculate':
                return await this.calculateDistance();
            case 'advice':
                await AIHelper.giveAdvice('distance_calculation');
                return this;
            case 'back':
                return new PropulsorCheckScene(this.audioManager);
            default:
                return this;
        }
    }

    private async calculateDistance(): Promise<Scene> {
        let validCoordinates = false;
        let coordinates: Coordinates;

        while (!validCoordinates) {
            const coords = await this.getCoordinatesInput();
            const validation = this.distanceCalculator.validateCoordinates(coords);
            
            if (validation.valid) {
                coordinates = coords;
                validCoordinates = true;
            } else {
                console.log(chalk.red('\n❌ COORDENADAS INVÁLIDAS:'));
                validation.errors.forEach(error => {
                    console.log(chalk.red(`   • ${error}`));
                });
                console.log(chalk.yellow('\n🔄 Por favor, ingresa coordenadas válidas.\n'));
            }
        }

        // Procesar cálculo de distancia con manejo de sigilo
        const result = await this.distanceCalculator.processDistanceCalculation(coordinates!);
        
        if (result.stealthDeactivated) {
            console.log(chalk.green(`\n✅ Distancia final: ${result.finalDistance.toFixed(2)} metros`));
            console.log(chalk.green('🕶️ Velo de invisibilidad desactivado - Distancia segura alcanzada'));
            
            if (result.iterations > 0) {
                console.log(chalk.blue(`🔄 Reposicionamientos realizados: ${result.iterations}`));
            }
            
            this.audioManager.playStealth();
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            return new SecurityCodeScene(this.audioManager);
        } else {
            console.log(chalk.red('\n⚠️ No se pudo alcanzar distancia segura después de múltiples intentos'));
            console.log(chalk.red('🦖 Godzilla nos ha detectado...'));
            
            this.audioManager.playRoar();
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            return new CombatScene(this.audioManager, false);
        }
    }

    private async getCoordinatesInput(): Promise<Coordinates> {
        const questions = [
            { name: 'x1', message: 'Coordenada X1 (50-1000):' },
            { name: 'y1', message: 'Coordenada Y1 (50-1000):' },
            { name: 'x2', message: 'Coordenada X2 (50-1000):' },
            { name: 'y2', message: 'Coordenada Y2 (50-1000):' }
        ];

        const coordinates: any = {};
        
        for (const question of questions) {
            const { value } = await inquirer.prompt([
                {
                    type: 'number',
                    name: 'value',
                    message: question.message,
                    validate: (input: number) => {
                        if (isNaN(input) || input < 50 || input > 1000) {
                            return 'Debe ser un número entre 50 y 1000';
                        }
                        return true;
                    }
                }
            ]);
            coordinates[question.name] = value;
        }

        return coordinates as Coordinates;
    }
}

export class SecurityCodeScene extends Scene {
    private securityGenerator: SecurityCodeGenerator;

    constructor(audioManager: AudioManager) {
        super(audioManager);
        this.securityGenerator = new SecurityCodeGenerator();
    }

    async render(): Promise<void> {
        console.clear();
        console.log(chalk.cyan.bold('🔒 GENERACIÓN DE CÓDIGO DE SEGURIDAD'));
        console.log('══════════════════════════════════════════════════════');
        console.log();
        console.log(chalk.yellow('🔐 Para autorizar el despegue necesitamos generar un código de seguridad.'));
        console.log(chalk.white('   • 10 números aleatorios que cumplan: n % 50 = 1'));
        console.log(chalk.white('   • Ordenados de forma descendente'));
        console.log(chalk.white('   • Sin duplicados'));
        console.log();
    }

    async handleInput(input: any): Promise<Scene | null> {
        const { action } = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: '¿Qué deseas hacer?',
                choices: [
                    { name: '🔐 Generar código de seguridad', value: 'generate' },
                    { name: '🤖 Pedir consejo a la IA', value: 'advice' },
                    { name: '🔙 Volver a cálculo de distancia', value: 'back' }
                ]
            }
        ]);

        switch (action) {
            case 'generate':
                return await this.generateSecurityCode();
            case 'advice':
                console.log(chalk.cyan('\n🤖 IA ALIADA:'));
                console.log(chalk.blue('💡 El código de seguridad es automático. Simplemente genera el código y procede.'));
                console.log(chalk.yellow('⚡ Recuerda: cada número cumple n % 50 = 1, lo que significa números como 51, 101, 151, etc.'));
                await new Promise(resolve => setTimeout(resolve, 2000));
                return this;
            case 'back':
                return new DistanceCalculationScene(this.audioManager);
            default:
                return this;
        }
    }

    private async generateSecurityCode(): Promise<Scene> {
        console.log(chalk.yellow('\n🔄 Generando código de seguridad...'));
        this.audioManager.playBeep();
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const securityCode = this.securityGenerator.generateSecurityCode();
        
        console.log();
        this.securityGenerator.displaySecurityCode(securityCode);
        
        // Validar el código generado (para demostrar que cumple requisitos)
        const validation = this.securityGenerator.validateSecurityCode(securityCode);
        
        if (validation.valid) {
            console.log(chalk.green('\n✅ Código de seguridad válido y listo para usar'));
        } else {
            console.log(chalk.red('\n❌ Error en la generación del código:'));
            validation.errors.forEach(error => console.log(chalk.red(`   • ${error}`)));
            return this; // Reintentar
        }
        
        const { proceed } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'proceed',
                message: '¿Proceder con la secuencia de despegue?',
                default: true
            }
        ]);

        if (proceed) {
            return new LaunchSequenceScene(this.audioManager);
        } else {
            return this;
        }
    }
}

export class LaunchSequenceScene extends Scene {
    private launchSequence: LaunchSequence;

    constructor(audioManager: AudioManager) {
        super(audioManager);
        this.launchSequence = new LaunchSequence();
    }

    async render(): Promise<void> {
        console.clear();
        console.log(chalk.cyan.bold('🚀 SECUENCIA DE DESPEGUE'));
        console.log('════════════════════════════════════════════════════');
        console.log();
        console.log(chalk.green('✅ Código de seguridad autorizado'));
        console.log(chalk.green('✅ Propulsores verificados'));
        console.log(chalk.green('✅ Distancia segura confirmada'));
        console.log();
        console.log(chalk.yellow('🚀 Iniciando secuencia de despegue automática...'));
        console.log();
    }

    async handleInput(input: any): Promise<Scene | null> {
        const { confirm } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'confirm',
                message: '¿Confirmas el inicio de la secuencia de despegue?',
                default: true
            }
        ]);

        if (confirm) {
            return await this.startLaunchSequence();
        } else {
            return new SecurityCodeScene(this.audioManager);
        }
    }

    private async startLaunchSequence(): Promise<Scene> {
        console.log(chalk.green('\n🔥 ¡INICIANDO DESPEGUE!'));
        this.audioManager.playLaunch();
        this.audioManager.playCountdown();
        
        // Ejecutar la secuencia de despegue completa
        await this.launchSequence.startLaunchSequence();
        
        console.log(chalk.green('\n🎉 ¡DESPEGUE COMPLETADO CON ÉXITO!'));
        console.log(chalk.cyan('🌌 La nave ha escapado de la atmósfera terrestre'));
        console.log(chalk.yellow('✨ ¡Has salvado a la humanidad!'));
        
        this.audioManager.playVictory();
        
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        return new VictoryScene(this.audioManager);
    }
}

export class CombatScene extends Scene {
    private godzilla: GodzillaEnemy;
    private superChargeActive: boolean;

    constructor(audioManager: AudioManager, superChargeActive: boolean = false) {
        super(audioManager);
        this.godzilla = new GodzillaEnemy();
        this.superChargeActive = superChargeActive;
        
        if (this.superChargeActive) {
            this.godzilla.activateSuperCharge();
        }
    }

    async render(): Promise<void> {
        console.clear();
        console.log(chalk.red.bold('⚔️ COMBATE CON GODZILLA'));
        console.log('════════════════════════════════════════════════════');
        console.log();
        
        if (this.superChargeActive) {
            console.log(chalk.red('💥 ¡GODZILLA HA ACTIVADO SUPER CHARGE!'));
            console.log(chalk.red('⚡ Todos sus ataques tienen 10x más poder'));
            console.log();
        }
        
        console.log(chalk.yellow(`🦖 ${this.godzilla.name} se acerca...`));
        console.log(chalk.red('🔥 La batalla es inevitable'));
        console.log();
        
        this.audioManager.playRoar();
    }

    async handleInput(input: any): Promise<Scene | null> {
        const choices = [
            { name: '⚔️ Intentar atacar (muy arriesgado)', value: 'attack' },
            { name: '🛡️ Activar escudos defensivos', value: 'defend' },
            { name: '🏃 Buscar ruta de escape alternativa', value: 'escape' },
            { name: '🤖 Pedir consejo urgente a la IA', value: 'advice' }
        ];

        const { action } = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: '¿Qué estrategia eliges ante Godzilla?',
                choices
            }
        ]);

        switch (action) {
            case 'attack':
                return await this.attemptAttack();
            case 'defend':
                return await this.attemptDefense();
            case 'escape':
                return await this.attemptEscape();
            case 'advice':
                await AIHelper.giveAdvice('combat_decision');
                return this;
            default:
                return this;
        }
    }

    private async attemptAttack(): Promise<Scene> {
        console.log(chalk.red('\n⚔️ Intentas atacar a Godzilla...'));
        this.audioManager.playAttack();
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log(chalk.red('💥 Tu ataque apenas rasguña su piel'));
        console.log(chalk.red('🦖 Godzilla contraataca con furia...'));
        
        this.godzilla.executeAttackSequence();
        this.audioManager.playDefeat();
        
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        return new DefeatScene(this.audioManager, 'Intentaste luchar contra lo imposible');
    }

    private async attemptDefense(): Promise<Scene> {
        console.log(chalk.blue('\n🛡️ Activas todos los escudos defensivos...'));
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log(chalk.yellow('⚡ Los escudos resisten momentáneamente'));
        console.log(chalk.red('🦖 Pero Godzilla es demasiado poderoso...'));
        
        this.godzilla.executeAttackSequence();
        this.audioManager.playDefeat();
        
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        return new DefeatScene(this.audioManager, 'Los escudos no fueron suficientes');
    }

    private async attemptEscape(): Promise<Scene> {
        console.log(chalk.yellow('\n🏃 Buscas una ruta de escape desesperada...'));
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Pequeña probabilidad de escape si no hay Super Charge
        const escapeChance = this.superChargeActive ? 0 : 0.3;
        const successful = Math.random() < escapeChance;
        
        if (successful) {
            console.log(chalk.green('✅ ¡Milagrosamente encuentras una ruta de escape!'));
            console.log(chalk.cyan('🛸 Logras activar propulsores de emergencia'));
            
            this.audioManager.playThruster();
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            return new LaunchSequenceScene(this.audioManager);
        } else {
            console.log(chalk.red('❌ No encuentras escape posible'));
            console.log(chalk.red('🦖 Godzilla te alcanza...'));
            
            this.godzilla.executeAttackSequence();
            this.audioManager.playDefeat();
            
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            return new DefeatScene(this.audioManager, 'No había escape posible');
        }
    }
}

export class VictoryScene extends Scene {
    async render(): Promise<void> {
        console.clear();
        this.displayVictoryArt();
        this.displayVictoryMessage();
    }

    private displayVictoryArt(): void {
        console.log(chalk.green.bold('╔══════════════════════════════════════════════════════════╗'));
        console.log(chalk.green.bold('║                    🎉 ¡VICTORIA! 🎉                     ║'));
        console.log(chalk.green.bold('║                                                          ║'));
        console.log(chalk.green.bold('║              🌍 MUNDO SALVADO 🌍                       ║'));
        console.log(chalk.green.bold('╚══════════════════════════════════════════════════════════╝'));
        console.log();
    }

    private displayVictoryMessage(): void {
        console.log(chalk.cyan('🚀 ¡MISIÓN COMPLETADA CON ÉXITO!'));
        console.log();
        console.log(chalk.yellow('📋 RESUMEN DE LA MISIÓN:'));
        console.log('✅ Sistemas de propulsores verificados');
        console.log('✅ Potencia calculada correctamente');
        console.log('✅ Distancia a Godzilla medida con éxito');
        console.log('✅ Código de seguridad generado');
        console.log('✅ Secuencia de despegue completada');
        console.log('✅ Escape exitoso de la Tierra');
        console.log();
        console.log(chalk.green('🌟 Has salvado a la humanidad de la destrucción total.'));
        console.log(chalk.blue('🛸 La nave espacial llevará a los supervivientes a un nuevo hogar.'));
        console.log(chalk.magenta('👨‍🚀 Serás recordado como el héroe que salvó al mundo.'));
        console.log();
        console.log(chalk.gray('🎮 ¡Gracias por jugar "Salvar al Mundo"!'));
        console.log();
    }

    async handleInput(input: any): Promise<Scene | null> {
        const { action } = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: '¿Qué deseas hacer?',
                choices: [
                    { name: '🔄 Jugar de nuevo', value: 'restart' },
                    { name: '🚪 Salir del juego', value: 'exit' }
                ]
            }
        ]);

        switch (action) {
            case 'restart':
                return new MainMenuScene(this.audioManager);
            case 'exit':
                console.log(chalk.cyan('\n🌟 ¡Hasta la vista, héroe!'));
                return null;
            default:
                return this;
        }
    }
}

export class DefeatScene extends Scene {
    private reason: string;

    constructor(audioManager: AudioManager, reason: string) {
        super(audioManager);
        this.reason = reason;
    }

    async render(): Promise<void> {
        console.clear();
        this.displayDefeatArt();
        this.displayDefeatMessage();
    }

    private displayDefeatArt(): void {
        console.log(chalk.red.bold('╔══════════════════════════════════════════════════════════╗'));
        console.log(chalk.red.bold('║                    💀 DERROTA 💀                       ║'));
        console.log(chalk.red.bold('║                                                          ║'));
        console.log(chalk.red.bold('║              🌍 MUNDO DESTRUIDO 🌍                     ║'));
        console.log(chalk.red.bold('╚══════════════════════════════════════════════════════════╝'));
        console.log();
    }

    private displayDefeatMessage(): void {
        console.log(chalk.red('💥 ¡MISIÓN FALLIDA!'));
        console.log();
        console.log(chalk.yellow('📋 CAUSA DE LA DERROTA:'));
        console.log(chalk.white(`   ${this.reason}`));
        console.log();
        console.log(chalk.red('🦖 Godzilla ha destruido la civilización humana.'));
        console.log(chalk.gray('🌆 Las ciudades yacen en ruinas.'));
        console.log(chalk.blue('💫 Pero tu valentía será recordada por las futuras generaciones...'));
        console.log();
        console.log(chalk.yellow('🎮 Cada decisión importa. ¿Intentarás de nuevo?'));
        console.log();
    }

    async handleInput(input: any): Promise<Scene | null> {
        const { action } = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: '¿Qué deseas hacer?',
                choices: [
                    { name: '🔄 Intentar de nuevo', value: 'restart' },
                    { name: '🏠 Volver al menú principal', value: 'menu' },
                    { name: '🚪 Salir del juego', value: 'exit' }
                ]
            }
        ]);

        switch (action) {
            case 'restart':
                return new PropulsorCheckScene(this.audioManager);
            case 'menu':
                return new MainMenuScene(this.audioManager);
            case 'exit':
                console.log(chalk.gray('\n💀 La humanidad recordará tu sacrificio...'));
                return null;
            default:
                return this;
        }
    }
}
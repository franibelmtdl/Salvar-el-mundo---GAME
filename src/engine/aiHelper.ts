import chalk from 'chalk';
import { PropulsorState } from '../logic/propulsores';

export interface Character {
    name: string;
    health: number;
    maxHealth: number;
    attack: number;
    defense: number;
    level: number;
    experience: number;
}

export interface Enemy extends Character {
    aiType: 'aggressive' | 'defensive' | 'balanced';
    specialAbility?: string;
}

export type GameSituation = 
    | 'propulsor_check'
    | 'distance_calculation'
    | 'combat_decision'
    | 'escape_route'
    | 'power_allocation'
    | 'stealth_mode';

export class AIHelper {
    public static createEnemy(name: string, level: number, aiType: 'aggressive' | 'defensive' | 'balanced'): Enemy {
        const baseStats = {
            health: 50 + (level * 20),
            attack: 10 + (level * 5),
            defense: 5 + (level * 2)
        };

        return {
            name,
            health: baseStats.health,
            maxHealth: baseStats.health,
            attack: baseStats.attack,
            defense: baseStats.defense,
            level,
            experience: level * 100,
            aiType,
            specialAbility: this.getSpecialAbility(aiType)
        };
    }

    public static createPlayer(name: string): Character {
        return {
            name,
            health: 100,
            maxHealth: 100,
            attack: 15,
            defense: 10,
            level: 1,
            experience: 0
        };
    }

    private static getSpecialAbility(aiType: string): string {
        switch (aiType) {
            case 'aggressive':
                return 'Ataque Feroz';
            case 'defensive':
                return 'Escudo Protector';
            case 'balanced':
                return 'Contraataque';
            default:
                return 'Ataque Básico';
        }
    }

    public static calculateDamage(attacker: Character, defender: Character): number {
        const baseDamage = attacker.attack;
        const defense = defender.defense;
        const damage = Math.max(1, baseDamage - defense);
        
        // Añadir variación aleatoria (±20%)
        const variation = 0.8 + (Math.random() * 0.4);
        return Math.floor(damage * variation);
    }

    public static aiDecision(enemy: Enemy, player: Character): 'attack' | 'defend' | 'special' {
        const healthPercentage = enemy.health / enemy.maxHealth;
        
        switch (enemy.aiType) {
            case 'aggressive':
                if (healthPercentage > 0.3) {
                    return Math.random() < 0.7 ? 'attack' : 'special';
                } else {
                    return Math.random() < 0.5 ? 'attack' : 'defend';
                }
            
            case 'defensive':
                if (healthPercentage < 0.5) {
                    return Math.random() < 0.6 ? 'defend' : 'attack';
                } else {
                    return Math.random() < 0.4 ? 'attack' : 'special';
                }
            
            case 'balanced':
                if (healthPercentage > 0.6) {
                    return Math.random() < 0.5 ? 'attack' : 'special';
                } else if (healthPercentage > 0.3) {
                    return Math.random() < 0.4 ? 'defend' : 'attack';
                } else {
                    return Math.random() < 0.3 ? 'attack' : 'defend';
                }
            
            default:
                return 'attack';
        }
    }

    public static levelUp(character: Character): boolean {
        const requiredExp = character.level * 200;
        if (character.experience >= requiredExp) {
            character.level++;
            character.experience -= requiredExp;
            
            // Mejorar estadísticas
            const healthIncrease = 20;
            const attackIncrease = 5;
            const defenseIncrease = 3;
            
            character.maxHealth += healthIncrease;
            character.health = character.maxHealth; // Curar completamente al subir nivel
            character.attack += attackIncrease;
            character.defense += defenseIncrease;
            
            return true;
        }
        return false;
    }

    // IA Aliada para el juego principal - Consejo estratégico
    public static async giveAdvice(situation: GameSituation, context?: any): Promise<void> {
        console.log(chalk.cyan('🤖 IA ALIADA - CONSEJO ESTRATÉGICO'));
        console.log(chalk.cyan('═══════════════════════════════════'));
        
        switch (situation) {
            case 'propulsor_check':
                this.advisePropulsorStrategy(context?.propulsorState);
                break;
            case 'distance_calculation':
                this.adviseDistanceStrategy(context?.distance);
                break;
            case 'combat_decision':
                this.adviseCombatStrategy();
                break;
            case 'escape_route':
                this.adviseEscapeStrategy(context?.powerLevel);
                break;
            case 'power_allocation':
                this.advisePowerStrategy(context?.currentPower);
                break;
            case 'stealth_mode':
                this.adviseStealthStrategy();
                break;
            default:
                console.log(chalk.yellow('🤔 Situación no reconocida. Mantén la calma y evalúa todas las opciones.'));
        }
        
        console.log();
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    private static advisePropulsorStrategy(propulsorState?: PropulsorState): void {
        if (!propulsorState) {
            console.log(chalk.yellow('💡 Recomendación: Verifica el estado de ambos propulsores antes de continuar.'));
            return;
        }

        if (propulsorState.izquierdo && propulsorState.derecho) {
            console.log(chalk.green('✅ Excelente: Ambos propulsores operativos. Solo necesitas 75% de potencia.'));
            console.log(chalk.blue('🎯 Estrategia: Distribuye la carga uniformemente entre ambos propulsores.'));
        } else if (propulsorState.izquierdo || propulsorState.derecho) {
            const working = propulsorState.izquierdo ? 'izquierdo' : 'derecho';
            console.log(chalk.yellow(`⚠️  Solo el propulsor ${working} funciona. Necesitas 90% + requisito especial.`));
            console.log(chalk.blue('🎯 Estrategia: Concentra toda la potencia en el propulsor funcional.'));
        } else {
            console.log(chalk.red('🚨 CRÍTICO: Ningún propulsor funciona. Prepárate para el combate inevitable.'));
            console.log(chalk.blue('🎯 Estrategia: Activa todos los sistemas defensivos disponibles.'));
        }
    }

    private static adviseDistanceStrategy(distance?: number): void {
        if (distance === undefined) {
            console.log(chalk.yellow('💡 Recomendación: Calcula la distancia exacta a Godzilla antes de moverte.'));
            return;
        }

        if (distance < 300) {
            console.log(chalk.yellow('🕶️ Velo de invisibilidad activo. Muévete con cuidado.'));
            console.log(chalk.blue('🎯 Estrategia: Reposiciónate gradualmente para mantener distancia segura.'));
        } else {
            console.log(chalk.green('✅ Distancia segura alcanzada. Puedes proceder con el despegue.'));
            console.log(chalk.blue('🎯 Estrategia: Mantén esta distancia mientras preparas la secuencia.'));
        }
    }

    private static adviseCombatStrategy(): void {
        console.log(chalk.red('⚔️ Situación de combate detectada.'));
        console.log(chalk.yellow('💡 Recomendación: El combate directo con Godzilla es suicida.'));
        console.log(chalk.blue('🎯 Estrategia: Prioriza la evasión y busca oportunidades de escape.'));
        console.log(chalk.gray('📊 Datos: Godzilla supera cualquier capacidad defensiva humana.'));
    }

    private static adviseEscapeStrategy(powerLevel?: number): void {
        console.log(chalk.cyan('🛸 Analizando ruta de escape...'));
        
        if (powerLevel && powerLevel >= 75) {
            console.log(chalk.green('✅ Potencia suficiente para escape inmediato.'));
            console.log(chalk.blue('🎯 Estrategia: Ejecuta secuencia de despegue sin demora.'));
        } else {
            console.log(chalk.yellow('⚠️  Potencia insuficiente. Necesitas optimizar el sistema.'));
            console.log(chalk.blue('🎯 Estrategia: Redirige energía de sistemas no críticos.'));
        }
    }

    private static advisePowerStrategy(currentPower?: number): void {
        console.log(chalk.yellow('⚡ Analizando distribución de energía...'));
        
        if (currentPower && currentPower < 50) {
            console.log(chalk.red('🚨 Energía críticamente baja.'));
            console.log(chalk.blue('🎯 Estrategia: Desactiva sistemas auxiliares inmediatamente.'));
        } else if (currentPower && currentPower < 75) {
            console.log(chalk.yellow('⚠️  Energía por debajo del óptimo.'));
            console.log(chalk.blue('🎯 Estrategia: Optimiza la eficiencia de los propulsores.'));
        } else {
            console.log(chalk.green('✅ Niveles de energía adecuados.'));
            console.log(chalk.blue('🎯 Estrategia: Mantén reservas para emergencias.'));
        }
    }

    private static adviseStealthStrategy(): void {
        console.log(chalk.gray('🕶️ Modo sigilo recomendado.'));
        console.log(chalk.blue('🎯 Estrategia: Minimiza emisiones de energía y ruido.'));
        console.log(chalk.yellow('💡 Recomendación: Usa este tiempo para preparar sistemas críticos.'));
        console.log(chalk.gray('📊 Datos: Godzilla responde principalmente a amenazas directas.'));
    }
}
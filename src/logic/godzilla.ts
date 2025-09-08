export interface Attack {
    name: string;
    basePower: number;
    description: string;
}

export class GodzillaEnemy {
    public readonly name = "The Killer (Godzilla)";
    private attacks: Attack[] = [
        {
            name: "Aliento Atómico",
            basePower: 1000,
            description: "Un devastador rayo de energía atómica"
        },
        {
            name: "Rayo Espiral",
            basePower: 800,
            description: "Un rayo espiral de energía destructiva"
        },
        {
            name: "Golpe de Cola",
            basePower: 600,
            description: "Un poderoso golpe con su cola masiva"
        }
    ];

    private superChargeActive = false;

    public activateSuperCharge(): void {
        this.superChargeActive = true;
        console.log('💥 ¡GODZILLA ACTIVA SUPER CHARGE!');
        console.log('⚠️  Todos los ataques se multiplican x10');
        
        this.attacks.forEach(attack => {
            const originalPower = attack.basePower;
            attack.basePower *= 10;
            console.log(`🔥 ${attack.name}: ${originalPower} → ${attack.basePower} poder`);
        });
    }

    public executeAttackSequence(): void {
        console.log(`🦖 ${this.name} ejecuta secuencia de ataque devastadora:`);
        console.log('═══════════════════════════════════════════════════════');
        
        this.attacks.forEach((attack, index) => {
            console.log(`${index + 1}. ${attack.name}`);
            console.log(`   💪 Poder: ${attack.basePower}`);
            console.log(`   📝 ${attack.description}`);
            if (this.superChargeActive) {
                console.log(`   ⚡ SUPER CHARGE ACTIVO (x10 poder)`);
            }
            console.log();
        });

        const totalDamage = this.attacks.reduce((total, attack) => total + attack.basePower, 0);
        console.log(`💀 Daño total: ${totalDamage} puntos`);
        
        if (this.superChargeActive) {
            console.log('🌍 La destrucción es inevitable...');
        }
    }

    public getAttacks(): Attack[] {
        return [...this.attacks]; // Retornar copia para evitar modificaciones externas
    }

    public isSuperChargeActive(): boolean {
        return this.superChargeActive;
    }

    public getTotalPower(): number {
        return this.attacks.reduce((total, attack) => total + attack.basePower, 0);
    }

    public resetSuperCharge(): void {
        if (this.superChargeActive) {
            this.superChargeActive = false;
            this.attacks.forEach(attack => {
                attack.basePower = Math.floor(attack.basePower / 10);
            });
            console.log('🔄 Super Charge desactivado - Poder base restaurado');
        }
    }
}

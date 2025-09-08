export interface PropulsorState {
    izquierdo: boolean;
    derecho: boolean;
}

export interface SystemPower {
    hidroPropulsor: number;
    potencia: number;
    poderBase: number;
}

export class PropulsorSystem {
    private readonly INITIAL_HYDRO_PROPULSOR = 5000;
    private readonly INITIAL_POTENCIA = 10000;
    
    constructor() {}

    public getInitialSystemPower(): SystemPower {
        const hidroPropulsor = this.INITIAL_HYDRO_PROPULSOR;
        const potencia = this.INITIAL_POTENCIA;
        const poderBase = hidroPropulsor + potencia;

        return {
            hidroPropulsor,
            potencia,
            poderBase
        };
    }

    public calculateTakeoffThreshold(propulsorState: PropulsorState): number {
        // Si ambos propulsores están en buena condición → 75%
        if (propulsorState.izquierdo && propulsorState.derecho) {
            return 75;
        }
        // En cualquier otro caso → 90%
        return 90;
    }

    public calculateSpecialRequirements(propulsorState: PropulsorState, systemPower: SystemPower): {
        requeridoDerecho?: number;
        requeridoIzquierdo?: number;
    } {
        const requirements: any = {};

        // Si solo el derecho funciona
        if (propulsorState.derecho && !propulsorState.izquierdo) {
            // requeridoDerecho = el 90% a la 4ta potencia entre 2 elementos * hidroPropulsor
            const base = Math.pow(0.90, 4) / 2;
            requirements.requeridoDerecho = base * systemPower.hidroPropulsor;
        }

        // Si solo el izquierdo funciona
        if (propulsorState.izquierdo && !propulsorState.derecho) {
            // requeridoIzquierdo = el 90% a la 2da potencia entre 3 elementos * potencia
            const base = Math.pow(0.90, 2) / 3;
            requirements.requeridoIzquierdo = base * systemPower.potencia;
        }

        return requirements;
    }

    public checkTakeoffAuthorization(
        propulsorState: PropulsorState, 
        systemPower: SystemPower, 
        currentPowerPercentage: number
    ): {
        authorized: boolean;
        message: string;
        details: any;
    } {
        // Si ningún propulsor funciona → fallo total
        if (!propulsorState.izquierdo && !propulsorState.derecho) {
            return {
                authorized: false,
                message: "SOLDADO... Cuando los 2 propulsores no están en funcionamiento...temo que debemos prepararnos para lo peor...",
                details: {
                    superChargeActivated: true,
                    reason: "Fallo total de propulsores"
                }
            };
        }

        const threshold = this.calculateTakeoffThreshold(propulsorState);
        const specialRequirements = this.calculateSpecialRequirements(propulsorState, systemPower);
        
        let authorized = currentPowerPercentage >= threshold;
        let details: any = {
            threshold,
            currentPower: currentPowerPercentage,
            propulsorState,
            specialRequirements
        };

        // Verificar requisitos especiales si solo uno funciona
        if (Object.keys(specialRequirements).length > 0) {
            const currentAbsolutePower = (currentPowerPercentage / 100) * systemPower.poderBase;
            
            if (specialRequirements.requeridoDerecho) {
                authorized = authorized && currentAbsolutePower >= specialRequirements.requeridoDerecho;
                details.requeridoDerecho = specialRequirements.requeridoDerecho;
                details.currentAbsolutePower = currentAbsolutePower;
            }
            
            if (specialRequirements.requeridoIzquierdo) {
                authorized = authorized && currentAbsolutePower >= specialRequirements.requeridoIzquierdo;
                details.requeridoIzquierdo = specialRequirements.requeridoIzquierdo;
                details.currentAbsolutePower = currentAbsolutePower;
            }
        }

        const message = authorized 
            ? "✅ Despegue autorizado" 
            : "❌ Fallo: potencia insuficiente";

        return {
            authorized,
            message,
            details
        };
    }
}

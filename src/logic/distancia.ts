export interface Coordinates {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

export class DistanceCalculator {
    private readonly MIN_COORDINATE = 50;
    private readonly MAX_COORDINATE = 1000;
    private readonly STEALTH_THRESHOLD = 300; // metros
    private readonly METER_SCALE = 100;

    public validateCoordinates(coords: Coordinates): {
        valid: boolean;
        errors: string[];
    } {
        const errors: string[] = [];
        const values = [coords.x1, coords.y1, coords.x2, coords.y2];

        // Verificar rango [50-1000]
        values.forEach((value, index) => {
            const coordName = ['X1', 'Y1', 'X2', 'Y2'][index];
            if (value < this.MIN_COORDINATE || value > this.MAX_COORDINATE) {
                errors.push(`${coordName} debe estar entre ${this.MIN_COORDINATE} y ${this.MAX_COORDINATE}`);
            }
        });

        // Verificar unicidad (todos diferentes)
        const uniqueValues = new Set(values);
        if (uniqueValues.size !== 4) {
            errors.push('Todas las coordenadas deben ser diferentes entre sí');
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    public calculateDistance(coords: Coordinates): number {
        // Escalar coordenadas por 100
        const scaledX1 = coords.x1 * this.METER_SCALE;
        const scaledY1 = coords.y1 * this.METER_SCALE;
        const scaledX2 = coords.x2 * this.METER_SCALE;
        const scaledY2 = coords.y2 * this.METER_SCALE;

        // Aplicar fórmula de Pitágoras
        const deltaX = scaledX2 - scaledX1;
        const deltaY = scaledY2 - scaledY1;
        const distance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));

        return distance;
    }

    public checkStealthMode(distance: number): {
        stealthActive: boolean;
        message: string;
    } {
        const stealthActive = distance < this.STEALTH_THRESHOLD;
        
        if (stealthActive) {
            return {
                stealthActive: true,
                message: `🕶️ Velo de invisibilidad ACTIVADO - Distancia: ${distance.toFixed(2)}m (< ${this.STEALTH_THRESHOLD}m)`
            };
        } else {
            return {
                stealthActive: false,
                message: `✅ Distancia segura: ${distance.toFixed(2)}m (≥ ${this.STEALTH_THRESHOLD}m)`
            };
        }
    }

    public async processDistanceCalculation(coords: Coordinates): Promise<{
        finalDistance: number;
        iterations: number;
        stealthDeactivated: boolean;
    }> {
        let currentCoords = { ...coords };
        let iterations = 0;
        let distance = this.calculateDistance(currentCoords);
        
        console.log(`📐 Distancia inicial calculada: ${distance.toFixed(2)} metros`);

        // Mantener "invisibilidad" hasta superar 300m
        while (distance < this.STEALTH_THRESHOLD && iterations < 10) { // Límite de seguridad
            iterations++;
            console.log(`🕶️ Velo de invisibilidad activo (iteración ${iterations})`);
            console.log('🔄 Simulando reposicionamiento...');
            
            // Simular movimiento del enemigo o reposicionamiento
            currentCoords = this.simulateRepositioning(currentCoords);
            distance = this.calculateDistance(currentCoords);
            
            console.log(`📏 Nueva distancia: ${distance.toFixed(2)} metros`);
            
            await new Promise(resolve => setTimeout(resolve, 1000)); // Pausa dramática
        }

        return {
            finalDistance: distance,
            iterations,
            stealthDeactivated: distance >= this.STEALTH_THRESHOLD
        };
    }

    private simulateRepositioning(coords: Coordinates): Coordinates {
        // Simular movimiento aleatorio manteniendo validez
        const adjustment = Math.random() * 200 + 50; // Entre 50 y 250
        
        return {
            x1: Math.min(this.MAX_COORDINATE, Math.max(this.MIN_COORDINATE, coords.x1 + adjustment)),
            y1: Math.min(this.MAX_COORDINATE, Math.max(this.MIN_COORDINATE, coords.y1 + adjustment)),
            x2: Math.min(this.MAX_COORDINATE, Math.max(this.MIN_COORDINATE, coords.x2 - adjustment)),
            y2: Math.min(this.MAX_COORDINATE, Math.max(this.MIN_COORDINATE, coords.y2 - adjustment))
        };
    }
}

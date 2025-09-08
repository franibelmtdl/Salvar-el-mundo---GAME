export class CalcularDistancia {
    
    validarNumeros(x1: number, y1: number, x2: number, y2: number): boolean {
        if (x1 < 50 || x1 > 1000) return false;
        if (y1 < 50 || y1 > 1000) return false;
        if (x2 < 50 || x2 > 1000) return false;
        if (y2 < 50 || y2 > 1000) return false;
        
        let numeros = [x1, y1, x2, y2];
        for (let i = 0; i < numeros.length; i++) {
            for (let j = i + 1; j < numeros.length; j++) {
                if (numeros[i] == numeros[j]) {
                    return false;
                }
            }
        }
        
        return true;
    }

    calcularDistancia(x1: number, y1: number, x2: number, y2: number): number {
        let x1_escalado = x1 * 100;
        let y1_escalado = y1 * 100;
        let x2_escalado = x2 * 100;
        let y2_escalado = y2 * 100;
        
        let diferencia_x = x2_escalado - x1_escalado;
        let diferencia_y = y2_escalado - y1_escalado;
        
        let distancia = Math.sqrt((diferencia_x * diferencia_x) + (diferencia_y * diferencia_y));
        
        return distancia;
    }

    estasMuyCerca(distancia: number): boolean {
        if (distancia < 300) {
            return true;
        } else {
            return false;
        }
    }
}

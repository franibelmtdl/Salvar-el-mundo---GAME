export class SecurityCodeGenerator {
    public generateSecurityCode(): number[] {
        const codeArray: number[] = [];
        const attempts = new Set<number>(); // Para evitar duplicados

        // Generar 10 números que cumplan n % 50 == 1
        while (codeArray.length < 10) {
            // Generar número aleatorio de la forma 50k + 1
            const k = Math.floor(Math.random() * 100) + 1; // k entre 1 y 100
            const number = 50 * k + 1;
            
            // Evitar duplicados
            if (!attempts.has(number)) {
                attempts.add(number);
                codeArray.push(number);
            }
        }

        // Ordenar de forma estrictamente descendente
        codeArray.sort((a, b) => b - a);

        return codeArray;
    }

    public validateSecurityCode(code: number[]): {
        valid: boolean;
        errors: string[];
    } {
        const errors: string[] = [];

        // Verificar longitud
        if (code.length !== 10) {
            errors.push(`Longitud incorrecta: ${code.length} (debe ser 10)`);
        }

        // Verificar congruencia n % 50 == 1
        const invalidNumbers = code.filter(n => n % 50 !== 1);
        if (invalidNumbers.length > 0) {
            errors.push(`Números inválidos (no cumplen n % 50 == 1): ${invalidNumbers.join(', ')}`);
        }

        // Verificar orden descendente estricto
        for (let i = 0; i < code.length - 1; i++) {
            if (code[i] <= code[i + 1]) {
                errors.push(`Orden incorrecto en posición ${i}-${i + 1}: ${code[i]} <= ${code[i + 1]}`);
                break;
            }
        }

        // Verificar duplicados
        const uniqueNumbers = new Set(code);
        if (uniqueNumbers.size !== code.length) {
            errors.push('Contiene números duplicados');
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    public displaySecurityCode(code: number[]): void {
        console.log('🔒 CÓDIGO DE INICIACIÓN GENERADO:');
        console.log('═══════════════════════════════════');
        
        code.forEach((number, index) => {
            console.log(`${(index + 1).toString().padStart(2, '0')}. ${number.toString().padStart(4, '0')}`);
        });
        
        console.log('═══════════════════════════════════');
        console.log(`✅ Todos los números cumplen: n % 50 = 1`);
        console.log(`✅ Ordenados descendentemente`);
        console.log(`✅ Sin duplicados`);
    }
}

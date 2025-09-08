export class GeneradorCodigo {
    
    generarNumeroValido(): number {
        let k = Math.floor(Math.random() * 100) + 1;
        let numero = 50 * k + 1;
        return numero;
    }

    generarCodigo(): number[] {
        let codigo: number[] = [];
        
        while (codigo.length < 10) {
            let nuevoNumero = this.generarNumeroValido();
            
            let yaExiste = false;
            for (let i = 0; i < codigo.length; i++) {
                if (codigo[i] == nuevoNumero) {
                    yaExiste = true;
                    break;
                }
            }
            
            if (!yaExiste) {
                codigo.push(nuevoNumero);
            }
        }
        
        codigo.sort((a, b) => b - a);
        
        return codigo;
    }

    verificarCodigo(codigo: number[]): boolean {
        if (codigo.length != 10) return false;
        
        for (let i = 0; i < codigo.length; i++) {
            if (codigo[i] % 50 != 1) {
                return false;
            }
        }
        
        for (let i = 0; i < codigo.length - 1; i++) {
            if (codigo[i] <= codigo[i + 1]) {
                return false;
            }
        }
        
        return true;
    }
}

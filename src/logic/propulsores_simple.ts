export class PropulsorBasico {
    hidroPropulsor = 5000;
    potencia = 10000;
    
    constructor() {
    }

    calcularPoderBase() {
        let poder = this.hidroPropulsor + this.potencia;
        return poder;
    }

    verificarPropulsores(izquierdo: boolean, derecho: boolean) {
        if (izquierdo == true && derecho == true) {
            return 75;
        } else {
            return 90;
        }
    }

    calcularRequeridoDerecho() {
        let base = Math.pow(0.90, 4);
        let resultado = (base / 2) * this.hidroPropulsor;
        return resultado;
    }

    calcularRequeridoIzquierdo() {
        let base = Math.pow(0.90, 2);
        let resultado = (base / 3) * this.potencia;
        return resultado;
    }

    puedesDespegar(izquierdo: boolean, derecho: boolean, porcentajePoder: number) {
        if (!izquierdo && !derecho) {
            return false;
        }

        let umbral = this.verificarPropulsores(izquierdo, derecho);
        
        if (porcentajePoder >= umbral) {
            return true;
        } else {
            return false;
        }
    }
}

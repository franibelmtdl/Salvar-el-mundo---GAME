export class GodzillaEnemigo {
    ataques = [
        { nombre: "Aliento Atomico", poder: 1000 },
        { nombre: "Rayo Espiral", poder: 800 },
        { nombre: "Golpe de Cola", poder: 600 }
    ];
    
    superChargeActivo = false;

    activarSuperCharge() {
        this.superChargeActivo = true;
        for (let i = 0; i < this.ataques.length; i++) {
            this.ataques[i].poder = this.ataques[i].poder * 10;
        }
    }

    atacar(): { nombre: string, poder: number } {
        let ataqueRandom = Math.floor(Math.random() * this.ataques.length);
        return this.ataques[ataqueRandom];
    }

    calcularDañoTotal(): number {
        let total = 0;
        for (let i = 0; i < this.ataques.length; i++) {
            total += this.ataques[i].poder;
        }
        return total;
    }
}

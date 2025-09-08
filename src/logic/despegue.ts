export class LaunchSequence {
    private readonly TOTAL_DURATION_SECONDS = 120; // 2 minutos simulados
    private readonly TIME_SCALE = 5; // Escala 5x
    private readonly REAL_DURATION_SECONDS = this.TOTAL_DURATION_SECONDS / this.TIME_SCALE; // 24 segundos reales
    private readonly UPDATE_INTERVAL_SIMULATED = 5; // Cada 5 segundos simulados
    private readonly UPDATE_INTERVAL_REAL = this.UPDATE_INTERVAL_SIMULATED / this.TIME_SCALE; // 1 segundo real

    public async startLaunchSequence(): Promise<void> {
        console.log('🚀 INICIANDO SECUENCIA DE DESPEGUE');
        console.log('═══════════════════════════════════════════════');
        console.log(`⏱️  Duración total: ${this.TOTAL_DURATION_SECONDS} segundos simulados`);
        console.log(`⚡ Escala: ${this.TIME_SCALE}x (${this.REAL_DURATION_SECONDS} segundos reales)`);
        console.log(`📊 Actualizaciones cada ${this.UPDATE_INTERVAL_SIMULATED}s simulados (${this.UPDATE_INTERVAL_REAL}s reales)`);
        console.log();

        let simulatedTimeElapsed = 0;
        const totalUpdates = this.TOTAL_DURATION_SECONDS / this.UPDATE_INTERVAL_SIMULATED;
        let updateCount = 0;

        while (simulatedTimeElapsed < this.TOTAL_DURATION_SECONDS) {
            updateCount++;
            simulatedTimeElapsed += this.UPDATE_INTERVAL_SIMULATED;
            
            const percentage = (simulatedTimeElapsed / this.TOTAL_DURATION_SECONDS) * 100;
            const remainingSimulated = this.TOTAL_DURATION_SECONDS - simulatedTimeElapsed;
            
            this.displayProgress(simulatedTimeElapsed, percentage, remainingSimulated, updateCount, totalUpdates);
            
            // Esperar tiempo real correspondiente
            await new Promise(resolve => setTimeout(resolve, this.UPDATE_INTERVAL_REAL * 1000));
        }

        console.log();
        console.log('🎉 ¡DESPEGUE COMPLETO!');
        console.log('═══════════════════════════════════════════════');
    }

    private displayProgress(
        simulatedTime: number, 
        percentage: number, 
        remaining: number,
        updateCount: number,
        totalUpdates: number
    ): void {
        const progressBar = this.createProgressBar(percentage);
        const timestamp = this.formatSimulatedTime(simulatedTime);
        
        console.log(`[${timestamp}] ${progressBar} ${percentage.toFixed(1)}%`);
        console.log(`           ⏳ Restante: ${remaining}s simulados | Actualización ${updateCount}/${totalUpdates}`);
        
        // Eventos especiales en momentos clave
        if (simulatedTime === 30) {
            console.log('           🔥 Encendido de propulsores principales');
        } else if (simulatedTime === 60) {
            console.log('           🛸 Separación de plataforma de lanzamiento');
        } else if (simulatedTime === 90) {
            console.log('           🌌 Salida de la atmósfera');
        } else if (simulatedTime === 120) {
            console.log('           ⭐ Órbita alcanzada - Misión completada');
        }
        
        console.log();
    }

    private createProgressBar(percentage: number): string {
        const barLength = 20;
        const filledLength = Math.round((percentage / 100) * barLength);
        const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);
        return `[${bar}]`;
    }

    private formatSimulatedTime(seconds: number): string {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    public getSequenceInfo(): {
        totalDurationSimulated: number;
        totalDurationReal: number;
        timeScale: number;
        updateInterval: number;
    } {
        return {
            totalDurationSimulated: this.TOTAL_DURATION_SECONDS,
            totalDurationReal: this.REAL_DURATION_SECONDS,
            timeScale: this.TIME_SCALE,
            updateInterval: this.UPDATE_INTERVAL_REAL
        };
    }
}

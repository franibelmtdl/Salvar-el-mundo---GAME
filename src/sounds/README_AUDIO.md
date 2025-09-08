# 🎵 Archivos de Audio para el Juego

## Problema Actual
Los archivos de audio actuales pueden no funcionar correctamente en Windows con `play-sound`.

## Soluciones

### Opción 1: Crear archivos de audio simples
Puedes crear archivos de audio básicos usando herramientas online gratuitas:

1. **Para attack.mp3**: 
   - Ve a https://www.zapsplat.com/ o https://freesound.org/
   - Busca "sword attack" o "hit sound"
   - Descarga un archivo corto (1-2 segundos)
   - Renómbralo como `attack.mp3`

2. **Para roar.mp3**:
   - Busca "monster roar" o "dragon roar"
   - Descarga un archivo corto
   - Renómbralo como `roar.mp3`

3. **Para rocket.mp3**:
   - Busca "rocket launch" o "whoosh sound"
   - Descarga un archivo corto
   - Renómbralo como `rocket.mp3`

### Opción 2: Usar el modo sin audio
El juego ahora tiene un modo de respaldo que muestra mensajes visuales cuando no puede reproducir audio.

### Opción 3: Instalar reproductor de audio
En Windows, asegúrate de tener un reproductor de audio instalado como:
- Windows Media Player
- VLC Media Player
- O cualquier reproductor que pueda manejar archivos MP3

## Archivos Necesarios
Coloca estos archivos en la carpeta `src/sounds/`:

### **Sonidos Básicos (Requeridos):**
- `attack.mp3` (sonido de ataque)
- `roar.mp3` (rugido de Godzilla)
- `rocket.mp3` (sonido de cohete básico)

### **Sonidos Adicionales del Juego Completo:**
- `thruster.mp3` (encendido de propulsores)
- `launch.mp3` (mecanismo de despegue)
- `victory.mp3` (escape exitoso)
- `defeat.mp3` (derrota - Super Charge de Godzilla)
- `stealth.mp3` (velo de invisibilidad)
- `alert.mp3` (alertas del sistema)
- `beep.mp3` (código de seguridad)
- `countdown.mp3` (cuenta regresiva de despegue)

## Nota
Si no tienes archivos de audio, el juego funcionará perfectamente mostrando mensajes visuales en lugar de sonidos.


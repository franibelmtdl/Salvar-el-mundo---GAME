# 🚀 Salvar al Mundo

Juego de escape de Godzilla desarrollado en TypeScript puro.

## 📝 Descripción

La humanidad está al borde de la destrucción. Godzilla ha despertado y amenaza con destruirlo todo. Debes programar la nave espacial para escapar utilizando cálculos matemáticos precisos y decisiones estratégicas.

## ✨ Características

- 🎨 **ASCII Art** con figlet para títulos impresionantes
- 🌈 **Colores vibrantes** con chalk para una experiencia visual rica
- 🎵 **Sistema de audio completo** con play-sound
- 💬 **Interfaz interactiva** con inquirer
- 🧮 **Matemáticas avanzadas** implementadas en TypeScript
- 🤖 **IA aliada** que proporciona consejos estratégicos
- 🦖 **Enemigo Godzilla** con sistema Super Charge
- 🎯 **Múltiples finales** basados en decisiones del jugador

## 🛠️ Tecnologías

- **TypeScript** - Lenguaje principal
- **Node.js** - Runtime
- **Figlet** - ASCII art
- **Chalk** - Colores en terminal
- **Inquirer** - Interfaz interactiva
- **Play-sound** - Reproducción de audio

## 📂 Estructura del Proyecto

```
src/
├── index_simple.ts          # Punto de entrada
├── game_simple.ts           # Lógica principal del juego
├── engine/                  # Motor del juego
│   ├── audio.ts            # Sistema de audio
│   ├── scenes.ts           # Escenas avanzadas
│   └── aiHelper.ts         # IA aliada
├── logic/                   # Lógica de negocio
│   ├── propulsores_simple.ts # Cálculos de propulsión
│   ├── distancia_simple.ts   # Cálculo de distancia
│   ├── codigo_seguridad.ts   # Código de seguridad
│   └── godzilla_simple.ts    # Lógica de Godzilla
└── sounds/                  # Archivos de audio
    ├── attack.mp3
    ├── roar.mp3
    ├── rocket.mp3
    └── ... (8 sonidos más)
```

## 🚀 Instalación y Ejecución

### Requisitos
- Node.js v14+
- npm

### Pasos
```bash
# Clonar el repositorio
git clone <url-del-repo>
cd salvar-al-mundo

# Instalar dependencias
npm install

# Compilar
npm run build

# Ejecutar el juego
npm run dev
```

## 🎮 Cómo Jugar

### Objetivo
Escapar de Godzilla completando exitosamente la secuencia de despegue.

### Mecánicas Principales

1. **🔧 Verificación de Propulsores**
   - Revisar estado de propulsores izquierdo y derecho
   - Determinar umbral de potencia necesario

2. **⚡ Cálculo de Potencia**
   - Asignar porcentaje de potencia (0-100%)
   - Aplicar fórmulas matemáticas específicas
   - Obtener autorización de despegue

3. **📐 Medición de Distancia**
   - Ingresar coordenadas X1, Y1, X2, Y2 (50-1000)
   - Calcular distancia usando Pitágoras
   - Activar modo sigilo si distancia < 300m

4. **🔒 Código de Seguridad**
   - Generar código de 10 números aleatorios
   - Cumplir congruencia n % 50 = 1
   - Ordenar descendentemente

5. **🚀 Secuencia de Despegue**
   - Lanzamiento de 2 minutos en escala 5x
   - Progreso en tiempo real
   - ¡Escape exitoso!

## 🧮 Fórmulas Matemáticas

### Propulsores
```javascript
// Poder base
poderBase = hidroPropulsor + potencia = 5000 + 10000 = 15000

// Umbrales
ambos_funcionan = 75%
solo_uno = 90%

// Fórmulas especiales
requeridoDerecho = (0.90^4 / 2) * hidroPropulsor
requeridoIzquierdo = (0.90^2 / 3) * potencia
```

### Distancia
```javascript
// Escalado y Pitágoras
coordenadas_escaladas = coordenadas * 100
distancia = √((X2-X1)² + (Y2-Y1)²)

// Sigilo
if (distancia < 300) modo_invisible = true
```

### Código de Seguridad
```javascript
// Congruencia
numero = 50 * k + 1  // donde k es aleatorio
// Resultado: 51, 101, 151, 201, etc.
```

## 🎯 Finales Posibles

1. **🏆 Victoria** - Escape exitoso completando todos los pasos
2. **💥 Derrota por Super Charge** - Ambos propulsores fallan
3. **⚠️ Derrota por potencia** - Energía insuficiente

## 🎵 Sistema de Audio

El juego incluye 11 efectos de sonido:
- Rugido de Godzilla
- Encendido de propulsores
- Ataques
- Mecanismo de despegue
- Victoria, derrota, alertas, códigos, etc.

*Nota: Si el audio no funciona, el juego mostrará retroalimentación visual.*

## 🤖 IA Aliada

- Disponible en menú principal
- Consejos contextuales durante decisiones críticas
- Análisis estratégico de situaciones
- Recomendaciones tácticas

## 🎨 Experiencia Visual

- Títulos en ASCII art de gran formato
- Colores vibrantes para diferentes estados
- Interfaz de menús intuitiva
- Barras de progreso animadas
- Retroalimentación visual rica

## 📋 Comandos Disponibles

```bash
npm run dev          # Ejecutar versión principal
npm run dev-advanced # Ejecutar versión compleja
npm run build        # Compilar TypeScript
npm run watch        # Compilar en modo watch
```

## 🏗️ Desarrollo

Proyecto desarrollado con arquitectura modular y clean code:
- Separación clara de responsabilidades
- Clases especializadas por funcionalidad
- Sistema de audio robusto con fallbacks
- Validaciones completas de entrada
- Manejo de errores comprehensivo

## 📄 Licencia

MIT

---

**¡Salva a la humanidad y conviértete en el héroe que el mundo necesita! 🌍**

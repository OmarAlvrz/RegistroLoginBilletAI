# BilletAI - Reconocimiento de Billetes

BilletAI es una aplicación web diseñada para ayudar a personas con discapacidad visual a identificar billetes mediante el uso de inteligencia artificial. La aplicación utiliza la cámara del dispositivo para reconocer y anunciar el valor de los billetes en tiempo real.

## Características

- **Reconocimiento en tiempo real**: Identifica billetes utilizando la cámara del dispositivo
- **Retroalimentación visual**: Muestra el valor del billete en pantalla con formato de alto contraste
- **Retroalimentación auditiva**: Anuncia el valor del billete mediante síntesis de voz
- **Interfaz accesible**: Diseñada pensando en usuarios con discapacidad visual
- **Soporte para múltiples cámaras**: Permite cambiar entre cámara frontal y trasera
- **Diseño responsivo**: Funciona en dispositivos móviles y de escritorio

## Tecnologías Utilizadas

- **Frontend**:
  - HTML5, CSS3
  - TypeScript
  - Bootstrap 5
  - TensorFlow.js
  - Teachable Machine

- **Herramientas de Desarrollo**:
  - Webpack
  - TypeScript
  - NPM

## Instalación

1. Clona este repositorio:
git clone https://github.com/tu-usuario/BilletAI.git cd BilletAI

2. Instala las dependencias:
npm install

3. Inicia el servidor de desarrollo:
npm run start

4. Para ejecutar específicamente la página del escáner:
npm run start:scanner

## Estructura del Proyecto
BilletAI/
├── src/                  # Código fuente
│   ├── css/              # Estilos CSS
│   ├── js/               # Archivos TypeScript/JavaScript
│   │   ├── components/   # Componentes reutilizables
│   │   ├── index.ts      # Punto de entrada principal
│   │   └── scanner.ts    # Lógica del escáner de billetes
│   ├── index.html        # Página de inicio/registro
│   └── scanner.html      # Página del escáner de billetes
├── package.json          # Dependencias y scripts
├── tsconfig.json         # Configuración de TypeScript
└── webpack.config.js     # Configuración de Webpack


## Estado Actual

- **Reconocimiento de Billetes**: Funcional, utilizando un modelo entrenado con Teachable Machine
- **Sistema de Login/Registro**: Implementado de forma básica, pero actualmente no está completamente funcional. Se planea migrar a Firebase para una autenticación más robusta.

## Limitaciones Conocidas

- El sistema de autenticación actual es solo para demostración y no está completamente implementado.
- El reconocimiento de billetes puede requerir buenas condiciones de iluminación para mayor precisión.
- La síntesis de voz puede variar en calidad dependiendo del navegador y dispositivo.

## Planes Futuros

- Implementar autenticación completa con Firebase
- Mejorar la precisión del modelo de reconocimiento
- Añadir soporte para más denominaciones de billetes
- Implementar funcionalidades offline

## Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue para discutir los cambios que te gustaría realizar.

## Licencia

Este proyecto está licenciado bajo la Licencia ISC.
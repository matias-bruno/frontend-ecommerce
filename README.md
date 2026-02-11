# Frontend E-commerce

Frontend moderno para un e-commerce interactivo con arquitectura modular y servidor Node.js.

## 🚀 Características

- **Arquitectura Modular**: Código organizado en módulos ES6+ para mejor mantenibilidad
- **Carrito de Compras Dinámico**: Gestión completa con localStorage
- **Autenticación de Usuarios**: Sistema de login/logout funcional
- **Catálogo de Productos**: Carga dinámica desde API REST
- **Diseño Responsivo**: Compatible con todos los dispositivos
- **Servidor Node.js**: Servidor HTTP estático para desarrollo local
- **Interfaz Intuitiva**: Experiencia de usuario fluida con Bootstrap

## 🛠 Tecnologías Utilizadas

- **Node.js**: Servidor backend y entorno de ejecución
- **JavaScript ES6+**: Módulos, async/await, imports/exports
- **HTML5 Semántico**: Estructura accesible y optimizada para SEO
- **CSS3 + Bootstrap**: Estilos modernos y diseño responsivo
- **LocalStorage**: Persistencia de datos del carrito localmente
- **API REST**: Consumo de datos de productos

## 📁 Estructura del Proyecto

```
frontend-ecommerce/
├── index.html              # Página principal
├── server.js               # Servidor Node.js para desarrollo
├── package.json            # Configuración del proyecto
├── js/
│   ├── main.js             # Punto de entrada y orquestador
│   └── modules/
│       ├── auth.js         # Gestión de autenticación
│       ├── cart.js         # Funcionalidad del carrito
│       ├── products.js     # Carga y gestión de productos
│       ├── api.js          # Comunicación con APIs externas
│       └── ui.js           # Utilidades de interfaz
└── css/
    └── styles.css          # Estilos personalizados
```

## 🏁 Instalación y Ejecución

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/matias-bruno/frontend-ecommerce.git
   cd frontend-ecommerce
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo**:
   ```bash
   npm start
   ```

4. **Abrir el navegador**:
   Visita `http://localhost:3000`

## 🏗 Arquitectura del Código

El proyecto sigue un patrón de **módulos ES6+** donde cada funcionalidad está separada en archivos específicos:

- **main.js**: Orquestador principal que inicializa todos los módulos
- **modules/auth.js**: Gestiona login, logout y estado de autenticación
- **modules/cart.js**: Maneja operaciones del carrito (agregar, eliminar, actualizar)
- **modules/products.js**: Carga y renderiza productos desde APIs
- **modules/api.js**: Centraliza las llamadas HTTP a servicios externos
- **modules/ui.js**: Utilidades generales de interfaz de usuario

## 📦 Características Técnicas

- **Módulos ES6**: Imports/exports para mejor organización
- **Async/Await**: Manejo asíncrono de operaciones
- **Event Delegation**: Optimización de listeners de eventos
- **Error Handling**: Captura y manejo de errores global

## 🤝 Contribución

Este es un proyecto frontend diseñado para integrarse con cualquier backend de e-commerce. La arquitectura modular permite fácil personalización y extensión.

## 📄 Licencia

ISC License - Ver archivo LICENSE para más detalles.

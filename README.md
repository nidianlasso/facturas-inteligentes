# facturas-inteligentes
Aplicación web Full Stack para la extracción inteligente de datos de facturas mediante un modelo de lenguaje (LLM), con React 18, TypeScript, Node.js, Express y BD. Incluye API REST, carga y validación de documentos, gestión de facturas, consulta de información y reportes.

# Facturas Inteligentes

Sistema de gestión de facturas desarrollado con tecnologías modernas de JavaScript y TypeScript, que permite administrar y procesar información de manera sencilla y eficiente.

# Tecnologías utilizadas

El proyecto está desarrollado utilizando una arquitectura separada entre frontend y backend.

## Frontend
React.js: Biblioteca utilizada para construir la interfaz de usuario.
TypeScript: Lenguaje utilizado para mejorar la calidad del código mediante tipado estático.
## Backend
Node.js: Entorno de ejecución de JavaScript.
Express.js: Framework utilizado para desarrollar los servicios y endpoints de la API.
TypeScript: Utilizado para el desarrollo del backend, proporcionando mayor seguridad y mantenibilidad al código.
## Base de datos
SQLite: Se seleccionó SQLite por su facilidad de instalación y configuración. Al ser una base de datos ligera que no requiere instalar ni configurar un servidor independiente, permite simplificar la puesta en marcha del proyecto y facilita su ejecución en diferentes entornos.

## Requisitos previos

Antes de iniciar, asegúrate de tener instalado:
Node.js (versión compatible con el proyecto).
npm (incluido con Node.js).
Git.

## Instalación y ejecución
Sigue los siguientes pasos para instalar y ejecutar el proyecto localmente.
### Paso 1. Clonar el repositorio

Abre una terminal y ejecuta el siguiente comando:

```bash
git clone https://github.com/nidianlasso/facturas-inteligentes.git
```

### Paso 2. Ingresar a la carpeta del proyecto
```bash
cd facturas-inteligentes
```

### Paso 3. Instalar las dependencias
Ejecuta el siguiente comando para instalar todas las dependencias necesarias:
```bash
npm install
```
### Paso 3.1. Error de instalación
En caso de fallar la instación cuando se ejecuta el paso 3 se deben ejecutar los siguientes comandos:
```bash
cd frontend
npm install
cd ..
cd backend
npm install better-sqlite3
npm install
cd ..
npm install
```

### Paso 4. Configurar las variables de entorno
Dentro de la carpeta backend, carga el archivo enviado al correo .env o crea un archivo nuevo y
Agrega la siguiente variable de entorno:
.env
API_KEY_GEMINI=valor_enviado_al_correo


### Importante: El valor correspondiente a API_KEY_GEMINI será enviado al correo electrónico. Esta variable es necesaria para la integración con el servicio de Gemini.

### Paso 5. Inicializar el proyecto

Una vez instaladas las dependencias y configurada la variable de entorno, ejecuta:
```bash
npm run dev
```

Este comando iniciará el proyecto tanto frontEnd como backEnd en modo desarrollo.


Base de datos: SQLite
Para este proyecto se decidió utilizar SQLite debido a su facilidad de instalación, configuración y mantenimiento.

Entre sus principales ventajas se encuentran:

No requiere instalar un servidor de base de datos independiente.
Almacena la información en un archivo local.
Facilita la configuración del entorno de desarrollo.
Reduce los pasos necesarios para poner en funcionamiento el proyecto.
Es una alternativa ligera y eficiente para las necesidades del sistema.

### Arquitectura del proyecto
El sistema está construido con una separación entre frontend y backend:
Componente	Tecnología	Descripción:
Frontend	React.js	Construcción de la interfaz de usuario.
Lenguaje frontend	TypeScript	Tipado estático y mantenibilidad.
Backend	Node.js	Entorno de ejecución del servidor.
Framework backend	Express.js	Desarrollo de servicios y API REST.
Lenguaje backend	TypeScript	Desarrollo del servidor con tipado estático.
Base de datos	SQLite	Persistencia

### Durante la función eliminar actualmente se quita el registro de la base de datos pero queda el archivo guardado en /backend/uploads/, sin embargo no se debería hacer esta práctica
### para lo cual lo correcto sería agregarle un estado a la factura y cuando se "elimine" la factura cambie de estado.
### Detro de la carpeta docs/ se encuentran agregadas 2 facturas para realizar las pruebas junto con el diagrama de base de datos.

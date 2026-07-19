# Proyecto Gestión TI 2 - Sistema de Venta de Heno 🌾

## Descripción del Proyecto
Este es un sistema web integral diseñado para la gestión de ventas de heno y el control de inventario/reportes (incluyendo el módulo de animales). El proyecto está construido integrando un **Frontend dinámico en Angular** y un **Backend robusto en Spring Boot (Java)**.

## Arquitectura y Patrones de Diseño
El proyecto sigue una arquitectura **Cliente-Servidor** y emplea varios patrones de diseño y buenas prácticas de la industria:

### Backend (Spring Boot)
El backend está estructurado siguiendo un diseño multicapa y el patrón **MVC (Model-View-Controller)** adaptado para APIs REST:
*   **Controllers (`Controller/`)**: Exponen los *Endpoints* REST y manejan las peticiones HTTP entrantes, delegando la lógica a la capa de servicio.
*   **Services (`service/`)**: Encapsulan la lógica de negocio de la aplicación. Mantienen los controladores delgados.
*   **Repositories (`Repository/`)**: Implementan el **Patrón Repository** usando Spring Data JPA, abstrayendo y simplificando las consultas y operaciones CRUD a la base de datos.
*   **Entities (`Entity/`)**: Representan el modelo de dominio, mapeado directamente a las tablas de la base de datos relacional mediante anotaciones JPA/Hibernate.
*   **DTOs (`dto/`)**: Utiliza *Data Transfer Objects* (Objetos de Transferencia de Datos) para evitar exponer la base de datos y modelo de dominio directamente, mejorando la seguridad y optimizando la transferencia de información.
*   **Configuraciones (`config/`)**: Centraliza la configuración de componentes del sistema (como CORS, Seguridad, conexión con Cloudinary, etc.).

### Frontend (Angular)
*   **Arquitectura basada en Componentes**: La interfaz gráfica está dividida en componentes reutilizables, modulares y fáciles de mantener.
*   **Servicios Centralizados**: Se utilizan servicios para la comunicación HTTP con el backend REST y para compartir el estado entre componentes.
*   **Enrutamiento SPA (Single Page Application)**: Navegación fluida sin recargas completas de la página.

## Tecnologías Utilizadas

**Backend:**
*   Java 25
*   Spring Boot 4.1.0
*   Spring Data JPA & Hibernate
*   PostgreSQL (Base de Datos)
*   Lombok (Reducción de código boilerplate)
*   Cloudinary SDK (Gestión de almacenamiento en la nube de imágenes)

**Frontend:**
*   Angular 21
*   TypeScript
*   jsPDF y jsPDF-AutoTable (Para la generación y exportación de reportes PDF nativos)

**Infraestructura:**
*   Maven & NPM

## Requisitos Previos
Para poder levantar este proyecto en modo desarrollo en tu máquina local, necesitas:
*   [Java 25 (JDK)](https://adoptium.net/)
*   [Node.js](https://nodejs.org/) (v20 recomendada) y `npm`
*   [Angular CLI](https://angular.io/cli) global (`npm install -g @angular/cli`)
*   [PostgreSQL](https://www.postgresql.org/) instalado y en ejecución

## ¿Cómo ejecutar el proyecto?

### 1. Levantar el Backend (Java/Spring Boot)
1. Navega al directorio del backend:
   ```bash
   cd ventaHeno
   ```
2. Configura tu cadena de conexión a PostgreSQL y claves de Cloudinary dentro de `src/main/resources/application.properties` (o `.yml`).
3. Ejecuta la aplicación usando Maven Wrapper:
   ```bash
   # En Windows:
   mvnw.cmd spring-boot:run
   # En Linux/Mac:
   ./mvnw spring-boot:run
   ```
   El servidor backend estará escuchando (generalmente en el puerto 8080).

### 2. Levantar el Frontend (Angular)
1. En otra terminal, navega al directorio del frontend:
   ```bash
   cd frontend-VentaHeno
   ```
2. Instala las dependencias de Node:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo:
   ```bash
   ng serve
   ```
4. Abre tu navegador en `http://localhost:4200`.

## Estructura General de Directorios
```text
Proyecto-Gestion-TI2/
├── README.md                   # Documentación principal del proyecto (Este archivo)
├── frontend-VentaHeno/         # CÓDIGO FUENTE FRONTEND (Angular)
│   ├── src/
│   │   ├── app/                # Componentes, servicios, módulos y rutas
│   │   ├── assets/             # Archivos estáticos e imágenes
│   │   └── styles.css          # Estilos globales
│   └── package.json            # Scripts y dependencias de NPM
└── ventaHeno/                  # CÓDIGO FUENTE BACKEND (Spring Boot)
    ├── src/main/java/com/HenoTrade/ventaHeno/
    │   ├── config/             # Clases de configuración global
    │   ├── Controller/         # REST Controllers
    │   ├── dto/                # Data Transfer Objects
    │   ├── Entity/             # Modelos de Base de Datos
    │   ├── Repository/         # Interfaces Data JPA
    │   └── service/            # Lógica de Negocio
    ├── src/main/resources/     # application.properties (variables de entorno)
    └── pom.xml                 # Dependencias y configuración de Maven
```
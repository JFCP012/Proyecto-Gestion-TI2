# Etapa 1: Compilar el Frontend (Angular)
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend-VentaHeno/package*.json ./
RUN npm install
COPY frontend-VentaHeno/ ./
RUN npm run build

# Etapa 2: Compilar el Backend (Spring Boot / Java) con los archivos de Angular incluidos
FROM maven:3.9.9-eclipse-temurin-21 AS backend-build
WORKDIR /app/backend

# Copiar el pom.xml y código fuente
COPY ventaHeno/pom.xml ./
COPY ventaHeno/src ./src

# Copiar los archivos estáticos compilados de Angular a la carpeta estática de Spring Boot
COPY --from=frontend-build /app/frontend/dist/frontend-VentaHeno/browser/ src/main/resources/static/

# Compilar el JAR de producción omitiendo las pruebas unitarias
RUN mvn clean package -DskipTests

# Etapa 3: Crear la imagen final de ejecución
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=backend-build /app/backend/target/ventaHeno-0.0.1-SNAPSHOT.jar app.jar

# Exponer el puerto por defecto de la aplicación
EXPOSE 8080

# Comando para arrancar el servidor
ENTRYPOINT ["java", "-jar", "app.jar"]

# Etapa 1: Compilar el Backend (Spring Boot / Java)
FROM maven:3.9.9-eclipse-temurin-21 AS backend-build
WORKDIR /app/backend

# Copiar el pom.xml y código fuente
COPY pom.xml ./
COPY src ./src

# Compilar el JAR de producción omitiendo las pruebas unitarias
RUN mvn clean package -DskipTests

# Etapa 2: Crear la imagen final de ejecución
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=backend-build /app/backend/target/ventaHeno-0.0.1-SNAPSHOT.jar app.jar

# Exponer el puerto por defecto de la aplicación
EXPOSE 8080

# Comando para arrancar el servidor
ENTRYPOINT ["java", "-jar", "app.jar"]
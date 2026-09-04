# Etapa 1: Compilar el Backend usando Java 25 y Maven
FROM eclipse-temurin:25-jdk AS backend-build
WORKDIR /app/backend

# Instalar Maven en la imagen basada en Debian/Ubuntu de Temurin
RUN apt-get update && apt-get install -y maven && rm -rf /var/lib/apt/lists/*

COPY pom.xml ./
COPY src ./src

RUN mvn clean package -DskipTests

# Etapa 2: Crear la imagen final de ejecución ligera
FROM eclipse-temurin:25-jre-alpine
WORKDIR /app
COPY --from=backend-build /app/backend/target/ventaHeno-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
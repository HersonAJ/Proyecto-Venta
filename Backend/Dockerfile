# Etapa 1: build
FROM eclipse-temurin:17-jdk AS build
WORKDIR /workspace
COPY . .
RUN ./mvnw clean package -DskipTests -Dmaven.resources.skip=true

# Etapa 2: runtime
FROM eclipse-temurin:17-jdk
WORKDIR /app
COPY --from=build /workspace/target/ventas-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]


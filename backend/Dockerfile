# STAGE 1: Build the application
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copy the entire project to access the backend folder
COPY . .

# Run Maven specifically on the backend project
RUN mvn -f backend/pom.xml clean package -DskipTests

# STAGE 2: Run the application
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Copy the JAR from the backend's target folder
COPY --from=build /app/backend/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

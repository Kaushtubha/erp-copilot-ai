FROM gradle:8.7-jdk21-alpine AS builder
WORKDIR /app
COPY settings.gradle build.gradle ./
COPY src ./src
ENV GRADLE_OPTS="-Dorg.gradle.daemon=false -Dorg.gradle.jvmargs='-Xmx512m'"
RUN gradle bootJar --no-daemon --stacktrace -x test

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN addgroup -S erp && adduser -S erp -G erp
COPY --from=builder /app/build/libs/*.jar app.jar
RUN chown erp:erp app.jar
USER erp
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD wget -qO- http://localhost:8080/actuator/health || exit 1
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]

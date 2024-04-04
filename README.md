# Repositorio de código para Proyecto Final de Maestría

## Integrantes:
- Beatriz Mejía
- Juan Camilo Ramírez
- Alejandro Figueroa
- Sebastián Arango

## Configuración de pipelines de CI/CD para integración de código:
- Se configuran y cargan los workflows de CI/CD usando Github Actions de forma que se implementen los pipelines para cada una de las ramas definidas en Git Flow del proyecto.
- Se configuran workflows para cambios realizados en ramas 'Feature' y 'Develop'.
- Se configura comando único para reconocer cuando se quiera realizar el paso del código a la rama Develop, con previo análisis de cobertura de código.
- Se configura autimatización para la creación del Release con un número de versión de tag y su posterior paso a la rama master, con previo análisis de pruebas.
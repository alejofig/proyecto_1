[![codecov](https://codecov.io/gh/alejofig/proyecto_1/branch/develop/graph/badge.svg?token=U837L22MQ4)](https://codecov.io/gh/alejofig/proyecto_1)
[![version](https://img.shields.io/badge/version-v1.0.1-green.svg)]()

# Repositorio de código para Proyecto Final de Maestría

## Integrantes:
- Beatriz Mejía
- Juan Camilo Ramírez
- Alejandro Figueroa
- Sebastián Arango

## Configuración de pipelines de CI/CD para integración de código:
- Se configuran y cargan los workflows de CI/CD usando Github Actions de forma que se implementen los pipelines para cada una de las ramas definidas en Git Flow del proyecto.
- Se configuran workflows para cambios realizados en ramas 'Feature' y 'Develop'.
- Se configura comando único '(azul)' al final del commit, para reconocer cuando se quiera realizar el paso del código a la rama Develop, con previo análisis de cobertura de código.
- Se configura autimatización para la creación del Release con un número de versión de tag y su posterior paso a la rama master, con previo análisis de pruebas.

## Sprint 1
En el release Release Sprint 1 v1.0.2 se encuentra el app-mobile-sprint1.apk, el cual puede ser instalado en cualquier dispositivo con versión Android Lollipop 5.0 o superior.

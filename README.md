# Remi website

Landing independiente en React 19 y Vite para el fork Serguiales16/remi de OpenClaw. Incluye español e inglés, recursos locales, diseño responsive, cambio de personaje, FAQ accesible y una guía de instalación con copia de comandos.

## Desarrollo

```sh
npm install
npm run dev -- --host 0.0.0.0 --port 4173
```

## Producción

```sh
npm run build
```

Los archivos estáticos se generan en `dist/client`. Se pueden servir con cualquier hosting estático. El template también conserva los archivos necesarios para Sites.

La instalación de esta web es independiente del workspace pnpm principal. No requiere instalar ni arrancar el Gateway de OpenClaw.

## Docker

La web se sirve con Nginx en un contenedor que compila el proyecto durante la build.

```sh
docker compose up -d --build
```

Queda disponible en [http://localhost:8080](http://localhost:8080). Para detenerla:

```sh
docker compose down
```

El puerto del host se puede cambiar en `docker-compose.yml` (`8080:80`). La imagen final solo contiene `dist/client`, los archivos de Sites no se publican en el contenedor.

## Contenido y estilos

Los textos y enlaces están en `src/content.js`. Los estilos capturados están en `src/reference.css`; las adaptaciones y componentes de Remi, en `src/remi.css`.

La información describe la base actual del repositorio. Las mejoras propias de Remi en memoria, comportamiento y seguridad figuran como trabajo en diseño.

El diseño toma como referencia cindy.app por petición del proyecto. Las ilustraciones y fuentes se han descargado localmente de esa referencia. Su procedencia figura en `ASSETS.md`.

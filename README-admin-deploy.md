Admin server: despliegue local con Docker
========================================

Esto prepara y arranca el backend `admin/server` (API) usando Docker Compose, con Postgres.

Pasos (local):

1. Instalar Docker y Docker Compose en tu máquina.
2. Desde la raíz del repo, levantar los servicios:

```bash
docker compose up -d --build
```

3. Ejecutar migraciones y seed dentro del contenedor `admin`:

```bash
docker compose exec admin npm run db:migrate
docker compose exec admin npm run db:seed
```

4. Verificar que el servidor responde:

```bash
curl http://localhost:3001/health
```

5. En la aplicación cliente (`index.html`) ya configuré por defecto `window.HASHEM_CONFIG.DICTIONARY_API_BASE = 'http://localhost:3001'` para pruebas locales. En producción cambia esta URL por la del API real antes de desplegar.

Notas de seguridad y producción
- No guardes contraseñas en el repositorio. Usa `secrets`/variables de entorno en tu proveedor de hosting.
- Para desplegar en Render/Heroku/Railway o un VPS, configura las variables: `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `PORT`.
- Si quieres, puedo crear un workflow de GitHub Actions que despliegue `admin/server` a un host (necesitaré credenciales o permisos).

Guía de despliegue y actualización del diccionario
===============================================

Resumen
- Propósito: describir el flujo para actualizar `data/diccionario.json`, commitear los cambios y desplegar el sitio en `gh-pages`.

Actualizar el diccionario (local -> repo)
- Exporta o prepara el JSON con las entradas nuevas.
- Reemplaza el archivo del repositorio local: `data/diccionario.json`.
- Ejecuta el script de actualización (también hace commit y push si usas `--push`):

```bash
node scripts/update-dictionary.js data\\diccionario.json --message "Update diccionario.json from workspace" --push
```

Desplegar el sitio (publicar en `gh-pages`)
- Construir y desplegar la carpeta `dist` a `gh-pages`:

```bash
npm run deploy
```

Comprobaciones recomendadas
- Verifica el último commit en `gh-pages`:

```bash
git fetch origin
git --no-pager show --pretty=format:"%h %an %ad %s" origin/gh-pages -1
```

- Comprueba que `dist/data/diccionario.json` contiene las entradas esperadas.

Notas
- Git en Windows puede advertir sobre conversión LF/CRLF al tocar `dist/data/diccionario.json`; esto es habitual.
- Si usas un backend (`admin/server`), considera exponer una API autenticada para actualizar el diccionario en producción en lugar de commits directos.

Contacto
- Si quieres, automatizo un flujo CI/CD para que los cambios en `data/diccionario.json` lancen el deploy automáticamente.

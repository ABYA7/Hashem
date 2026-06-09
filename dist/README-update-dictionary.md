# Actualizar `data/diccionario.json` desde un exportado

Este script facilita reemplazar `data/diccionario.json` con el archivo exportado desde la aplicación y hacer commit al repositorio.

## Uso

1. Exporta el archivo desde la app:
   - Haz clic en el botón `Descargar Base Datos` del módulo Diccionario.
   - Guarda el archivo en tu equipo, por ejemplo `diccionario.json`.

2. Ejecuta el script:

```bash
cd C:\HASHEM
node scripts/update-dictionary.js path\to\diccionario.json --message "Actualizar diccionario" --push
```

Opciones:
- `--push`: envía el commit al remote configurado.
- `--message "Texto"` o `-m "Texto"`: define el mensaje de commit.
- `--no-commit`: solo actualiza el archivo, no hace commit.

## Qué hace

- Valida que el JSON sea correcto.
- Normaliza entradas si el archivo contiene un objeto en lugar de un array.
- Ordena términos alfabéticamente.
- Sobrescribe `data/diccionario.json`.
- Hace `git add`, `git commit` y, si usas `--push`, `git push`.

## Ejemplo

```bash
node scripts/update-dictionary.js ./diccionario.json --message "Actualizar diccionario desde UI" --push
```

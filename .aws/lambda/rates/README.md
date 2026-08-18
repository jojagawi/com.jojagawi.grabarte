# Rates Lambda

Handler para registrar calificaciones del sitio y guardar JSON en S3.

## Archivo principal

- `lambda-rates-handler.mjs`

## Variables de entorno esperadas

- `AWS_REGION`: region de AWS
- `RATES_BUCKET`: bucket destino (ej. `dam.inspiraarte.com`)
- `RATES_PREFIX`: prefijo destino (ej. `rates/`)
- `RATES_API_KEY`: opcional, valida header `x-api-key`

## Payload esperado

```json
{
  "name": "Maria Perez",
  "product": "Termo personalizado",
  "description": "Excelente calidad y entrega puntual",
  "rating": 5
}
```

## Prueba local rapida

1. Simula el evento con `event.sample.json`.
2. Ejecuta con Node 20+ importando el handler.

> Nota: Para ejecutar localmente necesitas credenciales AWS con permiso `s3:PutObject` al bucket de destino.


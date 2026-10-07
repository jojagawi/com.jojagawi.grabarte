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
  "rating": 5,
  "designId": 15
}
```

`designId` es opcional: es el `Designs.id` del producto calificado. El formulario lo envía cuando
se abre con `?id=15` (por ejemplo `https://www.inspiraarte.com/agregar-calificacion/?id=15`) y el
id corresponde a un diseño publicado. Si viene, debe ser un entero positivo o la Lambda responde 400.

## Relación con productos en Athena

La tabla de Athena necesita la columna `designid` (el SerDe JSON no distingue mayúsculas, así que
lee la llave `designId` del JSON). Ejecutar **una vez, antes de desplegar el sitio** que la consulta:

```sql
ALTER TABLE inspiraarte_rates.rates ADD COLUMNS (designid int);
```

Las calificaciones anteriores quedan con `designid` nulo. Las aprobadas (`status = 1`) con
`designid` se muestran en la ficha del producto y se marcan en su JSON-LD (`aggregateRating` y `review`).

## Prueba local rapida

1. Simula el evento con `event.sample.json`.
2. Ejecuta con Node 20+ importando el handler.

> Nota: Para ejecutar localmente necesitas credenciales AWS con permiso `s3:PutObject` al bucket de destino.


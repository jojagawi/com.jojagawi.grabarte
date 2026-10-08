# Rates Lambda

Recibe las calificaciones del sitio (`/agregar-calificacion`) y las guarda como JSON en S3, donde
Athena las consulta (tabla `RatesGlueTable` de `.aws/infra.yml`).

## Flujo

1. **`rate_upload`** (solo si el cliente adjunta foto): el navegador ya convirtió la foto a WebP
   (máximo 1600 px, sin metadatos EXIF). La Lambda genera el id de la calificación y devuelve un
   POST firmado para `s3://<bucket>/imagenes-usuarios/<id>.webp`. La política firmada fija la llave,
   el tipo `image/webp` y el tamaño (5 MB como máximo), así que S3 rechaza lo que no coincida.
2. **`add_client_rate`**: valida los datos y guarda `s3://<bucket>/rates/<id>.json`. Si trae
   `rateId`, confirma que la foto existe y que ese id no tiene calificación guardada, y usa ese
   mismo id: la foto y la fila de Athena comparten identificador. El JSON lleva `hasImage: true`.

Cada acción exige su propio token de reCAPTCHA v3 (`rate_upload`, `add_client_rate`) con score ≥ 0.5.

Las fotos son públicas desde que se suben (la política del bucket publica `imagenes-usuarios/*`),
pero el id es un UUID imposible de adivinar y el sitio solo las muestra cuando la calificación
está activa (`status = 1`) en `/catalogos/calificaciones`.

## Archivo principal

- `lambda-rates-handler.mjs`

## Variables de entorno

- `AWS_REGION`: región de AWS (la define Lambda)
- `RATES_BUCKET`: bucket destino (ej. `dam.inspiraarte.com`)
- `RATES_PREFIX`: prefijo de las calificaciones (ej. `rates/`)
- `RATES_IMAGES_PREFIX`: opcional, prefijo de las fotos (por defecto `imagenes-usuarios/`)
- `RATES_API_KEY`: opcional, valida el header `x-api-key`
- `NEXT_GOOGLE_SECRET_KEY`: clave secreta de reCAPTCHA

## Empaquetado

`@aws-sdk/s3-presigned-post` no viene en el runtime de Lambda, así que el zip lleva sus dependencias:

```powershell
cd .aws/lambda/rates
npm install --omit=dev
Compress-Archive -Path lambda-rates-handler.mjs, package.json, node_modules -DestinationPath lambda-rates-handler.zip -Force
aws s3 cp lambda-rates-handler.zip s3://dam.inspiraarte.com/lambda/rates/lambda-rates-handler.zip
```

Después se despliega `.aws/infra.yml`. Ese despliegue también:

- agrega a la tabla de Athena las columnas `designid` (int) y `hasimage` (boolean); las
  calificaciones anteriores quedan con ambas en nulo, que el sitio trata como "sin producto" y
  "sin foto";
- da a la Lambda `s3:PutObject` y `s3:GetObject` sobre `rates/*` e `imagenes-usuarios/*`.

Despliega la infraestructura **antes** que el sitio: las consultas del sitio ya piden
`designid` y `hasimage`, y sin esas columnas Athena falla (el sitio sale sin testimonios ni opiniones).

## Payloads

```json
{ "action": "rate_upload", "recaptchaToken": "…", "type": "image/webp", "size": 248311 }
```

Respuesta: `{ "rateId": "<uuid>", "key": "imagenes-usuarios/<uuid>.webp", "url": "…", "fields": { … } }`.

```json
{
  "action": "add_client_rate",
  "recaptchaToken": "…",
  "name": "Maria Perez",
  "product": "Termo personalizado",
  "description": "Excelente calidad y entrega puntual",
  "rating": 5,
  "designId": 15,
  "rateId": "uuid devuelto por rate_upload (opcional)"
}
```

- `designId` es opcional: el `Designs.id` del producto calificado. El formulario lo envía cuando se
  abre con `?id=15` (por ejemplo `https://www.inspiraarte.com/agregar-calificacion/?id=15`) y el id
  corresponde a un diseño publicado.
- `rateId` es opcional: solo cuando se subió foto con `rate_upload`.

JSON guardado en `rates/<id>.json`:

```json
{
  "id": "e33df496-dca3-4d14-83ae-9a6801d01695",
  "name": "Maria Perez",
  "product": "Termo personalizado",
  "description": "Excelente calidad y entrega puntual",
  "rating": 5,
  "designId": 15,
  "hasImage": true,
  "createdAt": "2026-10-07T18:00:00.000Z",
  "status": 0,
  "source": "web"
}
```

# Contact Lambda

Recibe las solicitudes de cotización de `/contacto` (reemplaza el formulario de JotForm).

## Flujo

1. **`contact_upload`** (solo si hay adjuntos): valida hasta 5 archivos JPG, PNG, PDF, Excel (xlsx/xls), CSV, Word (docx) o texto de 10 MB
   como máximo y devuelve un `requestId` y una URL firmada (POST) por archivo. El navegador sube
   cada archivo directo a `s3://<bucket>/contact/uploads/<requestId>/`. La política firmada limita
   tamaño y tipo, así que S3 rechaza lo que no coincida.
2. **`contact_submit`**: valida los datos, confirma que los adjuntos existen y guarda
   `s3://<bucket>/contact/requests/<id>.json`. Después avisa en paralelo:
   - **HubSpot**: crea o actualiza el contacto por email y le asocia una nota con la solicitud.
   - **Slack**: mensaje con los datos, el producto y enlaces a los adjuntos en la consola de S3.

S3 es la fuente de verdad: si HubSpot o Slack fallan, la solicitud ya quedó guardada y el error
queda en CloudWatch. Cada acción exige su propio token de reCAPTCHA v3 (`contact_upload`,
`contact_submit`) con score ≥ 0.5.

Los adjuntos quedan privados: la política del bucket solo hace público `preview/*`.

## Archivo principal

- `lambda-contact-handler.mjs`

## Variables de entorno

- `AWS_REGION`: región de AWS (la define Lambda)
- `CONTACT_BUCKET`: bucket destino (ej. `dam.inspiraarte.com`)
- `CONTACT_PREFIX`: prefijo destino (ej. `contact/`)
- `CONTACT_API_KEY`: opcional, valida el header `x-api-key`
- `NEXT_GOOGLE_SECRET_KEY`: clave secreta de reCAPTCHA
- `HUBSPOT_API`: token de una app privada de HubSpot con los scopes
  `crm.objects.contacts.read` y `crm.objects.contacts.write`. Sin él se omite HubSpot.
- `SLACK_WEBHOOK_URL`: Incoming Webhook del canal de Slack. Sin él se omite Slack.

## Empaquetado

`@aws-sdk/s3-presigned-post` no viene en el runtime de Lambda, así que el zip lleva sus dependencias:

```powershell
cd .aws/lambda/contact
npm install --omit=dev
Compress-Archive -Path lambda-contact-handler.mjs, package.json, node_modules -DestinationPath lambda-contact-handler.zip -Force
aws s3 cp lambda-contact-handler.zip s3://dam.inspiraarte.com/lambda/contact/lambda-contact-handler.zip
```

Después se despliega `.aws/infra.yml` pasando los secretos como parámetros
(`ContactLambdaApiKey`, `HubspotApiToken`, `SlackWebhookUrl`, `NextGoogleSecretKey`).
La salida `ContactLambdaFunctionUrl` va en `NEXT_PUBLIC_CONTACT_LAMBDA_URL` del sitio.

## Payloads

```json
{ "action": "contact_upload", "recaptchaToken": "…", "files": [{ "name": "boceto.png", "type": "image/png", "size": 482133 }] }
```

```json
{
  "action": "contact_submit",
  "recaptchaToken": "…",
  "requestId": "uuid devuelto por contact_upload (opcional)",
  "name": "Maria Perez",
  "email": "maria@example.com",
  "phone": "5512345678",
  "occasion": "Boda",
  "productType": "MDF / madera",
  "requestedProduct": "IA-0185 · Torre de Dados en MDF",
  "quantity": "120",
  "neededBy": "2026-12-12",
  "details": "Recuerdos para 120 invitados…",
  "attachmentKeys": ["contact/uploads/<requestId>/1-boceto.png"],
  "pageUrl": "https://www.inspiraarte.com/contacto/?producto=…",
  "urgent": false
}
```

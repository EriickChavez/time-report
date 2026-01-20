# 🚀 Guía de Despliegue: Frontend Next.js

Esta guía explica cómo preparar y lanzar tu aplicación de Next.js a producción, garantizando un rendimiento óptimo y seguridad.

## 1. Configuración de Variables de Entorno

En Next.js, las variables de entorno se manejan de forma distinta si deben ser accesibles desde el navegador o solo desde el servidor.

1. Crea un archivo llamado `.env.production` en la raíz de tu proyecto.
2. Define la URL de tu API (la que configuramos con PM2 anteriormente):

```env
# NO NECESARIAS
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
# SI NECESARIAS
DATABASE_URL="mysql://3s3n9jXPRmMG3ix.root:Mfuv7NN74ZrmvKn3@gateway01.us-east-1.prod.aws.tidbcloud.com:4000/test?sslaccept=strict"
JWT_SECRET="secret-key"
BASE_URL="http://192.168.1.14:4021"

```

---

## 2. Preparación de la Base de Datos (Prisma)

Como utilizas **Prisma**, es vital generar el cliente de base de datos antes de compilar el proyecto:

```bash
# Genera el cliente basado en tu schema.prisma
npx prisma generate

```

---

## 3. Compilación para Producción (Build)

A diferencia del modo desarrollo (`next dev`), el modo producción optimiza el código, comprime imágenes y realiza el "Tree Shaking" (elimina código no usado).

```bash
# Limpia instalaciones previas (opcional)
npm install

# Crea la versión de producción
npm run build

```

---

## 4. Despliegue

### VPS Propio con PM2

Si prefieres tenerlo en tu propio servidor Linux junto a la API:

1. Instala PM2 globalmente: `npm install -g pm2`
2. Inicia el proceso de Next.js:

```bash
# El comando '-- start' le dice a PM2 que ejecute 'npm start'
pm2 start npm --name "time-report" -- start

```

3. Guarda el estado: `pm2 save`

---

## 5. Comandos de Mantenimiento

Para actualizar tu frontend después de hacer cambios en el código:

```bash
# 1. Bajar cambios
git pull origin main

# 2. Re-instalar y generar prisma
npm install
npx prisma generate

# 3. Volver a compilar
npm run build

# 4. Reiniciar el proceso (Solo si usas VPS/PM2)
pm2 restart frontend-reporte

```

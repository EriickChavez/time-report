# Time Report - Sistema de Reporte de Tiempo

Sistema de gestión de reportes de tiempo construido con Next.js 16, Prisma y MySQL.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración de Base de Datos](#-configuración-de-base-de-datos)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Scripts Disponibles](#-scripts-disponibles)
- [Uso](#-uso)

---

## ✨ Características

- ✅ Gestión de entradas de tiempo
- ✅ Configuración de campos personalizables por usuario
- ✅ Perfiles de usuario
- ✅ Arquitectura basada en repositorios
- ✅ Type-safe con TypeScript y Prisma
- ✅ UI moderna con Radix UI y Tailwind CSS

---

## 🛠 Tecnologías

- **Framework:** Next.js 16 (App Router)
- **Base de Datos:** MySQL
- **ORM:** Prisma 6.19.2
- **Lenguaje:** TypeScript 5
- **Estilos:** Tailwind CSS 4
- **UI Components:** Radix UI
- **Gestión de Estado:** Zustand
- **Validación:** Zod + React Hook Form

---

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** 18.x o superior
- **npm** o **yarn**
- **MySQL** 8.x o superior (local o en la nube)

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd time-report
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Base de datos MySQL
DATABASE_URL="mysql://usuario:contraseña@localhost:3306/time_report"

# Supabase (opcional - si usas autenticación)
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

---

## 🗄️ Configuración de Base de Datos

### Opción 1: MySQL Local

#### Paso 1: Crear la base de datos

```bash
mysql -u root -p
```

```sql
CREATE DATABASE time_report CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

#### Paso 2: Configurar `.env`

```env
DATABASE_URL="mysql://root:tu_password@localhost:3306/time_report"
```

#### Paso 3: Ejecutar migraciones

```bash
# Generar el cliente Prisma
npx prisma generate

# Crear y aplicar migraciones
npx prisma migrate dev --name init
```

### Opción 2: MySQL en la Nube

**Servicios recomendados:**

- [PlanetScale](https://planetscale.com/) (MySQL serverless)
- [Railway](https://railway.app/)
- [AWS RDS](https://aws.amazon.com/rds/)

**Ejemplo con PlanetScale:**

```env
DATABASE_URL="mysql://user:pass@aws.connect.psdb.cloud/time_report?sslaccept=strict"
```

```bash
npx prisma db push  # Para PlanetScale (no usa migraciones tradicionales)
```

### Verificar la conexión

```bash
# Abrir Prisma Studio para ver los datos
npx prisma studio
```

Esto abrirá una interfaz web en `http://localhost:5555` donde podrás ver y editar tus datos.

---

## 📁 Estructura del Proyecto

```
time-report/
├── app/                      # Next.js App Router
│   ├── actions/             # Server Actions
│   ├── login/               # Página de login
│   ├── signup/              # Página de registro
│   └── page.tsx             # Página principal
├── components/              # Componentes React reutilizables
├── infrastructure/          # Capa de repositorios
│   ├── PrismaFieldConfigRepository.ts
│   ├── PrismaTimeEntryRepository.ts
│   └── PrismaUserRepository.ts
├── interfaces/              # Interfaces TypeScript
├── lib/                     # Utilidades y configuraciones
│   └── prisma.ts           # Cliente Prisma singleton
├── prisma/
│   └── schema.prisma       # Esquema de base de datos
├── scripts/                 # Scripts SQL y utilidades
├── store/                   # Zustand stores
└── types/                   # Definiciones de tipos
```

---

## 📜 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Iniciar servidor de desarrollo (http://localhost:3000)

# Producción
npm run build            # Construir para producción
npm run start            # Iniciar servidor de producción

# Linting
npm run lint             # Ejecutar ESLint

# Prisma
npx prisma generate      # Generar cliente Prisma
npx prisma migrate dev   # Crear y aplicar migración
npx prisma migrate deploy # Aplicar migraciones en producción
npx prisma studio        # Abrir GUI de base de datos
npx prisma db push       # Sincronizar schema sin migraciones
npx prisma db pull       # Importar schema desde DB existente
```

---

## 💻 Uso

### Iniciar el servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Modelos de Base de Datos

El proyecto incluye tres modelos principales:

#### 1. **Profile** - Perfiles de usuario

```typescript
{
  id: string
  email: string
  fullName?: string
  avatarUrl?: string
  createdAt: Date
  updatedAt: Date
}
```

#### 2. **FieldConfig** - Configuración de campos personalizados

```typescript
{
  id: string
  userId: string
  fieldId: string
  label: string
  type: string
  required: boolean
  enabled: boolean
  allowFiles: boolean
  options?: string[]
  order: number
}
```

#### 3. **TimeEntry** - Entradas de tiempo

```typescript
{
  id: string
  userId: string
  date: string
  startTime?: string
  endTime?: string
  reporter?: string
  status: string
  fieldData?: object
  files?: object
  // ... más campos
}
```

### Ejemplo de uso de repositorios

```typescript
import { prisma } from "@/lib/prisma";
import { PrismaTimeEntryRepository } from "@/infrastructure/PrismaTimeEntryRepository";

const repository = new PrismaTimeEntryRepository();

// Obtener entradas de tiempo de un usuario
const entries = await repository.getEntriesByUser("user-id");

// Crear nueva entrada
await repository.createEntry({
  userId: "user-id",
  date: "2026-01-15",
  status: "pending",
  // ... más campos
});
```

---

## 🔧 Solución de Problemas

### Error: "Property 'fieldConfig' does not exist"

**Solución:**

```bash
# Regenerar el cliente Prisma
npx prisma generate

# Reiniciar el servidor TypeScript en tu IDE
# VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server"
```

### Error de conexión a MySQL

**Verificar:**

1. MySQL está corriendo: `mysql -u root -p`
2. La base de datos existe: `SHOW DATABASES;`
3. Las credenciales en `.env` son correctas
4. El puerto es el correcto (por defecto: 3306)

### Migraciones no se aplican

```bash
# Resetear la base de datos (⚠️ borra todos los datos)
npx prisma migrate reset

# O aplicar manualmente
npx prisma migrate deploy
```

---

## 📝 Notas Adicionales

### Desarrollo con Prisma

- Después de modificar `schema.prisma`, siempre ejecuta `npx prisma generate`
- Usa `npx prisma studio` para inspeccionar datos visualmente
- Las migraciones se guardan en `prisma/migrations/`

### Variables de Entorno

**Nunca** commitees el archivo `.env` al repositorio. Usa `.env.example` como plantilla:

```env
# .env.example
DATABASE_URL="mysql://user:password@localhost:3306/database_name"
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

---

## 📄 Licencia

Este proyecto es privado.

---

## 👥 Contribuir

Para contribuir al proyecto:

1. Crea un branch: `git checkout -b feature/nueva-funcionalidad`
2. Haz commit de tus cambios: `git commit -m 'Agregar nueva funcionalidad'`
3. Push al branch: `git push origin feature/nueva-funcionalidad`
4. Abre un Pull Request

---

## 📞 Soporte

Si encuentras algún problema, por favor abre un issue en el repositorio.

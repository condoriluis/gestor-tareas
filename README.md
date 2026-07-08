# Gestor de Tareas

> Este es un proyecto de **gestor de tareas** desarrollado con **Next.js**, **React** y **TypeScript**. La aplicación permite a los usuarios agregar, editar, eliminar y visualizar tareas de forma eficiente y con un diseño intuitivo. Ideal para mantener el seguimiento de tareas personales o de trabajo.

## 🌐 Aplicación en Producción

[Visitar aplicación](https://gestor-tareas-luis.vercel.app)

## ✨ Características Clave

### 🖥 Interfaz de Usuario

- Filtros avanzados
- Modales contextuales
- Animaciones fluidas

### 🔐 Autenticación

- Login/Registro seguro
- Roles (Admin/Usuario)
- Recuperación de contraseña

### 📱 Responsive Design

- Mobile-first
- Adaptable a tablets
- Touch-friendly

## 📸 Galería

| Sección               | Captura                                                                                              |
| --------------------- | ---------------------------------------------------------------------------------------------------- |
| **Login**             | ![Login](https://res.cloudinary.com/dpyrrgou3/image/upload/v1751913315/9d89028d576b87_w0qy9d.jpg)    |
| **Registro**          | ![Registro](https://res.cloudinary.com/dpyrrgou3/image/upload/v1751913679/c8bf3519231917_qta5gf.jpg) |
| **Gestión de Tareas** | ![Tareas](https://res.cloudinary.com/dpyrrgou3/image/upload/v1751913450/3019540f51057d_r402vw.jpg)   |
| **Reportes**          | ![Reportes](https://res.cloudinary.com/dpyrrgou3/image/upload/v1751913679/196c1287cfbe9b_umtuv3.jpg) |

## 🛠 Stack Tecnológico

### Frontend

- Next.js 16
- React 19
- TypeScript 5.0
- Tailwind CSS 4.0

### Backend

- Next.js API Routes
- PostgreSQL (Supabase)
- Prisma ORM
- JWT Authentication

## 🚀 Cómo Empezar

### Requisitos

- Node.js 18+
- Cuenta en [Supabase](https://supabase.com) (PostgreSQL)

### Configurar base de datos

```bash
# Crea un proyecto en Supabase y copia tu connection string
# Edita .env.local con tus credenciales:

DATABASE_URL="postgresql://postgres.[project]:[password]@aws-0-ca-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[project]:[password]@aws-0-ca-central-1.pooler.supabase.com:5432/postgres"

# Sincronizar schema con Supabase
npx prisma db push
```

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/condoriluis/gestor-tareas.git

# Instalar dependencias
cd gestor-tareas && npm install

# Configurar entorno
cp .env.example .env.local

# Generar cliente Prisma y sincronizar schema
npx prisma generate
npx prisma db push

# Iniciar aplicación
npm run dev
```

## 📄 Licencia

MIT © [Luis Alberto](https://github.com/condoriluis)

---

# Gestor de Tareas

> Este es un proyecto de **gestor de tareas** desarrollado con **Next.js**, **React** y **TypeScript**. La aplicación permite a los usuarios agregar, editar, eliminar y visualizar tareas de forma eficiente y con un diseño intuitivo. Ideal para mantener el seguimiento de tareas personales o de trabajo.

## 🚀 Demo en Vivo
[Ver demostración](https://player.vimeo.com/video/1099463374)

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

| Sección | Captura |
|---------|---------|
| **Login** | ![Login](https://res.cloudinary.com/dpyrrgou3/image/upload/v1751913315/9d89028d576b87_w0qy9d.jpg) |
| **Registro** | ![Registro](https://res.cloudinary.com/dpyrrgou3/image/upload/v1751913679/c8bf3519231917_qta5gf.jpg) |
| **Gestión de Tareas** | ![Tareas](https://res.cloudinary.com/dpyrrgou3/image/upload/v1751913450/3019540f51057d_r402vw.jpg) |
| **Reportes** | ![Reportes](https://res.cloudinary.com/dpyrrgou3/image/upload/v1751913679/196c1287cfbe9b_umtuv3.jpg) |

## 🛠 Stack Tecnológico

### Frontend
- Next.js 15
- React 19
- TypeScript 5.0
- Tailwind CSS 4.0

### Backend
- Next.js API Routes
- MySQL 8.0
- JWT Authentication

## 🚀 Cómo Empezar

### Requisitos
- Node.js 18+
- MySQL 8.0+

### Crea la tabla users:

```sql
    CREATE TABLE users (
        id_user INT AUTO_INCREMENT PRIMARY KEY,
        email_user VARCHAR(255) NOT NULL,
        password_user VARCHAR(255) NOT NULL,
        name_user VARCHAR(255) DEFAULT NULL,
        status_user INT DEFAULT NULL,
        rol_user VARCHAR(20) DEFAULT NULL,
        date_created_user timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        date_updated_user timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
```
### Crea la tabla tasks:

```sql
CREATE TABLE tasks (
    id_task INT AUTO_INCREMENT PRIMARY KEY,
    id_user_task INT NOT NULL,
    title_task VARCHAR(60) NOT NULL,
    description_task VARCHAR(125) DEFAULT NULL,
    priority_task VARCHAR(8) NOT NULL,
    status_task VARCHAR(20) NOT NULL DEFAULT 'todo',
    date_start_task DATETIME DEFAULT NULL,
    date_completed_task DATETIME DEFAULT NULL,
    date_created_task timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_updated_task timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```
### Crea la tabla task_history:

```sql
CREATE TABLE task_history (
    id_history INT AUTO_INCREMENT PRIMARY KEY,
    id_task_history INT NOT NULL,
    id_user_history INT NOT NULL,
    old_status_history VARCHAR(30) DEFAULT NULL,
    new_status_history VARCHAR(30) DEFAULT NULL,
    action_history VARCHAR(50) DEFAULT NULL,
    description_history TEXT DEFAULT NULL,
    date_created_history timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_updated_history timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Instalación
```bash
# Clonar repositorio
git clone https://github.com/condoriluis/gestor-tareas.git

# Instalar dependencias
cd gestor-tareas && npm install

# Configurar entorno
cp .env.example .env.local

# Iniciar aplicación
npm run dev
```

## 📄 Licencia
MIT © [Luis Alberto](https://github.com/condoriluis)

---
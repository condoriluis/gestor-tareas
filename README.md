# Gestor de Tareas

Este es un proyecto de **gestión de tareas** desarrollado con **Next.js**, **React** y **TypeScript**. La aplicación permite a los usuarios agregar, editar, eliminar y visualizar tareas de forma eficiente y con un diseño intuitivo. Ideal para mantener el seguimiento de tareas personales o de trabajo.

## Características

- **Gestión de tareas**: Añadir, editar y eliminar tareas.
- **Estado de las tareas**: Visualización del estado de las tareas con colores indicadores (Ej: Pendiente, Completada).
- **Interfaz de usuario interactiva**: Uso de modales para confirmar la eliminación de tareas.
- **Diseño minimalista y profesional**: Basado en principios UI/UX con iconos y badges.
- **Desarrollado con TypeScript**: Beneficios del tipado estático y control de tipos en el desarrollo.

## Tecnologías utilizadas

- **Next.js**: Framework React con optimización de renderizado y enrutamiento.
- **React**: Biblioteca para construir interfaces de usuario interactivas.
- **TypeScript**: Superset de JavaScript para un desarrollo más robusto con tipado estático.
- **Tailwind CSS**: Framework de diseño que facilita el desarrollo con clases utilitarias.
- **React Icons**: Para añadir iconos en la interfaz de usuario.
- **MySQL**: Para almacenar datos de tareas.

## Instalación

Para instalar y ejecutar este proyecto en tu máquina local, sigue estos pasos:

1. Clona el repositorio:

   ```bash
   git clone https://github.com/condoriluis/gestor-tareas.git
   ```

2. Navega a la carpeta del proyecto:

   ```bash
   cd gestor-tareas
   ```

3. Instala las dependencias:

   ```bash
   npm install
   ```

4. Configura tu archivo .env.local: En la raíz del proyecto, crea un archivo .env.local si no existe. Este archivo debe contener las siguientes variables de entorno para configurar la conexión a la base de datos:

   ```bash
   DB_HOST=localhost
   DB_USER=tu_usuario_mysql
   DB_PASSWORD=tu_contraseña_mysql
   DB_NAME=task_manager
   DB_PORT=3306
   ```

5. Configuración de la Base de Datos

   ```sql
   CREATE DATABASE task_manager;
   ```

6. Crea la tabla tasks:

   ```sql
   CREATE TABLE tasks (
       id INT AUTO_INCREMENT PRIMARY KEY,
       title VARCHAR(255) NOT NULL,
       description TEXT NOT NULL,
       priority VARCHAR(10) NOT NULL,
       status ENUM('todo', 'pending', 'in_progress', 'done') NOT NULL DEFAULT 'pending',
       position INT NOT NULL DEFAULT 1,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   );
   ```

7. Ejecuta el proyecto:

   ```bash
   npm run dev
   ```

8. Abre el navegador y accede a la aplicación en:

   ```bash
   http://localhost:3000
   ```

## Uso

- **Agregar tareas**: Usa la interfaz para agregar nuevas tareas.
- **Editar tareas**: Haz clic en el ícono de editar para modificar una tarea existente.
- **Eliminar tareas**: Haz clic en el ícono de eliminar para confirmar la eliminación de una tarea mediante un modal de confirmación.
- **Filtrar por estado**: Las tareas pueden tener un estado que se muestra con un badge de color.

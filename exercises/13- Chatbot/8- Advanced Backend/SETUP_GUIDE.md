# 🚀 Guía de Instalación y Configuración Local

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** versión 18 o superior ([Descargar aquí](https://nodejs.org/))
- **npm** (incluido con Node.js) o **yarn**
- **Git** para clonar el repositorio
- **Editor de código** (recomendado: VS Code)

### Verificar instalaciones:
```bash
node --version    # Debe mostrar v18.x.x o superior
npm --version     # Debe mostrar 8.x.x o superior
git --version     # Debe mostrar la versión de git
```

---

## 📁 Estructura del Proyecto

```
8-Advanced-Backend/
├── 📁 express-api/          # Backend API (Node.js + Express + TypeScript)
│   ├── 📁 src/
│   │   ├── 📁 modules/      # Lógica de negocio organizada por módulos
│   │   ├── 📁 routes/       # Definición de rutas HTTP
│   │   ├── 📁 middleware/   # Middlewares personalizados
│   │   ├── 📁 db/          # Configuración y conexión a BD
│   │   ├── 📁 scripts/     # Scripts de utilidad e inicialización
│   │   └── 📄 index.ts     # Punto de entrada de la aplicación
│   ├── 📁 dist/            # Código TypeScript compilado
│   ├── 📄 database.sqlite  # Base de datos SQLite
│   ├── 📄 .env             # Variables de entorno
│   └── 📄 package.json     # Dependencias y scripts de npm
├── 📁 react/               # Frontend (React + TypeScript + Vite)
│   ├── 📁 src/
│   │   ├── 📁 components/  # Componentes React reutilizables
│   │   ├── 📁 hooks/       # Custom hooks para lógica compartida
│   │   ├── 📁 store/       # Estado global con Redux Toolkit
│   │   ├── 📁 services/    # Servicios para llamadas a la API
│   │   ├── 📁 context/     # Contextos de React
│   │   └── 📁 types/       # Definiciones de tipos TypeScript
│   ├── 📁 public/          # Archivos estáticos (index.html, favicon, etc.)
│   └── 📄 package.json     # Dependencias y scripts de npm
├── 📄 README.md            # Documentación principal
└── 📄 API_DOCUMENTATION.md # Documentación detallada de la API
```

---

## 🛠️ Instalación Paso a Paso

### Paso 1: Clonar o Navegar al Proyecto

```bash
# Si tienes el repositorio completo
cd path/to/uap-web-development/exercises/8-Advanced-Backend

# O si necesitas clonar
git clone <repository-url>
cd uap-web-development/exercises/8-Advanced-Backend
```

### Paso 2: Configurar el Backend

```bash
# Navegar al directorio del backend
cd express-api

# Instalar todas las dependencias
npm install
```

#### 2.1 Crear archivo de configuración

Crear el archivo `.env` en `express-api/.env`:

```env
# Configuración de la base de datos
DATABASE_URL=./database.sqlite

# Configuración JWT (CAMBIAR en producción)
JWT_SECRET=tu_clave_secreta_super_segura_para_jwt_tokens_2024

# Configuración del servidor
PORT=3001
NODE_ENV=development

# Configuración de CORS (URL del frontend)
CORS_ORIGIN=http://localhost:5173
```

> ⚠️ **Importante**: En producción, usa una clave JWT mucho más segura y aleatoria.

#### 2.2 Inicializar la base de datos

```bash
# Ejecutar script de inicialización (crea tablas y datos de prueba)
npm run init-db
```

#### 2.3 Compilar TypeScript

```bash
# Compilar el código TypeScript
npm run build
```

#### 2.4 Iniciar el servidor

```bash
# Modo desarrollo (auto-reload en cambios)
npm run dev

# O modo producción (código compilado)
npm start
```

✅ **El backend estará disponible en**: `http://localhost:3001`

### Paso 3: Configurar el Frontend

Abrir una **nueva terminal** y navegar al frontend:

```bash
# Navegar al directorio del frontend
cd react  # Si estás en el directorio raíz del proyecto
# O: cd ../react si estás en express-api

# Instalar todas las dependencias
npm install

# Iniciar el servidor de desarrollo
npm run dev
```

✅ **El frontend estará disponible en**: `http://localhost:5173` o `http://localhost:5174`

---

## ✅ Verificación de la Instalación

### Backend Health Check

En una terminal, ejecuta:

```bash
curl http://localhost:3001/health
```

**Respuesta esperada:**
```json
{
    "status": "OK",
    "timestamp": "2024-07-03T15:30:00.000Z"
}
```

### Frontend Check

1. Abre tu navegador web
2. Ve a `http://localhost:5173`
3. Deberías ver la aplicación de ToDo cargarse correctamente
4. Intenta hacer login con uno de los usuarios de prueba

---

## 👤 Usuarios de Prueba

El script de inicialización crea estos usuarios automáticamente:

| Email | Password | Descripción |
|-------|----------|-------------|
| `admin@example.com` | `Admin123!` | Usuario administrador |
| `user@example.com` | `User123!` | Usuario regular |
| `editor@example.com` | `Editor123!` | Usuario editor |

**Ejemplo de login:**
1. Ve a la página de login en el frontend
2. Usa `admin@example.com` / `Admin123!`
3. Explora las funcionalidades de tableros y tareas

---

## 📜 Scripts Disponibles

### Backend (`express-api/`)

```bash
npm run dev          # 🔄 Desarrollo con auto-reload (ts-node-dev)
npm run build        # 🏗️ Compilar TypeScript a JavaScript
npm start            # ▶️ Ejecutar versión compilada (producción)
npm run init-db      # 🗄️ Inicializar base de datos con datos de prueba
npm test             # 🧪 Ejecutar tests (si están configurados)
npm run migrate:todos-per-page  # 🔄 Ejecutar migración específica
```

### Frontend (`react/`)

```bash
npm run dev          # 🔄 Servidor de desarrollo (Vite)
npm run build        # 🏗️ Build para producción
npm run preview      # 👁️ Preview del build de producción
npm run lint         # 🔍 Verificar código con ESLint
```

---

## 🔧 Configuración Avanzada

### Variables de Entorno del Backend

El archivo `.env` en `express-api/` soporta estas variables:

```env
# Base de datos
DATABASE_URL=./database.sqlite          # Ruta a la BD SQLite
# Para PostgreSQL: postgresql://user:pass@host:port/db

# Autenticación
JWT_SECRET=clave-muy-segura            # Clave para firmar tokens JWT
JWT_EXPIRATION=24h                     # Tiempo de expiración (opcional)

# Servidor
PORT=3001                              # Puerto del servidor
NODE_ENV=development                   # Entorno: development | production

# CORS
CORS_ORIGIN=http://localhost:5173      # URL permitida para CORS
# Para múltiples: http://localhost:5173,http://localhost:5174

# Logging (opcional)
LOG_LEVEL=info                         # Nivel de logs: error | warn | info | debug
```

### Configuración del Frontend

El frontend usa Vite y se configura en `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
})
```

---

## 🐛 Solución de Problemas Comunes

### Error: "Puerto en uso"

```bash
# Encontrar qué proceso usa el puerto
# En Windows:
netstat -ano | findstr :3001

# En macOS/Linux:
lsof -i :3001

# Terminar el proceso (reemplaza <PID> con el ID del proceso)
# En Windows:
taskkill /PID <PID> /F

# En macOS/Linux:
kill -9 <PID>
```

### Error: "Base de datos no encontrada"

```bash
cd express-api
npm run init-db
```

### Error: "CORS policy"

Verificar que `CORS_ORIGIN` en `.env` coincida con la URL del frontend:
```env
CORS_ORIGIN=http://localhost:5173
```

### Error: "JWT Secret missing"

Asegurarse de que `JWT_SECRET` esté configurado en `.env`:
```env
JWT_SECRET=tu_clave_secreta_super_segura_para_jwt_tokens_2024
```

### Error: "Cannot find module"

```bash
# Reinstalar dependencias
npm install

# Limpiar cache de npm
npm cache clean --force
```

### Error de compilación TypeScript

```bash
# Verificar versión de TypeScript
npx tsc --version

# Reinstalar dependencias de desarrollo
npm install --save-dev typescript @types/node
```

---

## 🌐 URLs Importantes

| Servicio | URL Local | Descripción |
|----------|-----------|-------------|
| **Frontend** | http://localhost:5173 | Aplicación React |
| **Backend API** | http://localhost:3001/api | API REST |
| **Health Check** | http://localhost:3001/health | Estado del servidor |
| **Docs API** | [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) | Documentación completa |

---

## 🚀 Desarrollo Local

### Flujo de Trabajo Recomendado

1. **Terminal 1**: Backend en modo desarrollo
   ```bash
   cd express-api
   npm run dev
   ```

2. **Terminal 2**: Frontend en modo desarrollo
   ```bash
   cd react
   npm run dev
   ```

3. **Navegador**: Abrir `http://localhost:5173`

### Hot Reload

- **Backend**: Los cambios se recargan automáticamente con `ts-node-dev`
- **Frontend**: Los cambios se recargan instantáneamente con Vite HMR

### Base de Datos

- **SQLite** se usa para desarrollo local
- Archivo: `express-api/database.sqlite`
- Para ver datos: puedes usar herramientas como [DB Browser for SQLite](https://sqlitebrowser.org/)

---

## 📱 Testing de la API

### Con cURL

```bash
# Registrar usuario
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test123!"
  }'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'

# Crear tablero
curl -X POST http://localhost:3001/api/boards \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "Mi Tablero de Prueba"
  }'
```

### Con Postman

1. Importar la colección desde [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
2. Configurar variables de entorno:
   - `baseUrl`: `http://localhost:3001/api`
   - `boardId`: `1`
   - `todoId`: `1`

---

## 🏗️ Build para Producción

### Backend

```bash
cd express-api

# Compilar TypeScript
npm run build

# Instalar solo dependencias de producción
npm ci --only=production

# Ejecutar
npm start
```

### Frontend

```bash
cd react

# Crear build optimizado
npm run build

# Preview del build
npm run preview

# Los archivos están en dist/
```

### Variables de Entorno para Producción

```env
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://user:pass@host:port/db
JWT_SECRET=clave-extremadamente-segura-256-bits
CORS_ORIGIN=https://tu-dominio.com
```

---

## 📚 Recursos Adicionales

- [Documentación de la API](./API_DOCUMENTATION.md)
- [Express.js Docs](https://expressjs.com/)
- [React Docs](https://react.dev/)
- [TypeScript Docs](https://typescriptlang.org/)
- [Vite Docs](https://vitejs.dev/)
- [SQLite Docs](https://sqlite.org/docs.html)

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

¡Listo! Ahora tienes una aplicación ToDo completa funcionando localmente 🎉

# 🤖 Chatbot Inteligente - Next.js + Vercel AI SDK

Una aplicación de chatbot moderna y segura construida con **Next.js 15**, **Vercel AI SDK** e **OpenRouter**, con soporte para streaming en tiempo real y manejo robusto de errores.

## ✨ Características

### ✅ Requisitos Obligatorios Cumplidos

- **Interfaz de Chat Moderna**: UI responsiva y atractiva con Tailwind CSS
- **Streaming de Respuestas**: Respuestas en tiempo real del LLM
- **Manejo de Estado**: Persistencia de conversación en la sesión
- **Validación de Inputs**: Sanitización y validación de todos los mensajes
- **Indicadores de Carga**: Animación de typing indicator y spinner
- **Manejo de Errores**: Gestión robusta de errores con mensajes claros
- **Seguridad de API Keys**: API keys solo en el backend, nunca expuestas al cliente

### 🔒 Características de Seguridad

1. **API Keys solo en Backend**: Las credenciales se manejan exclusivamente en el servidor
2. **Variables de Entorno**: `.env.local` para configuración sensible (no versionado)
3. **Validación de Inputs**: Límite de caracteres y sanitización
4. **Manejo de Errores Seguro**: Sin exposición de información sensible

## 🛠️ Stack Tecnológico

### Frontend

- **Next.js 15**: App Router, Server/Client Components
- **React 19**: Hooks personalizados, componentes funcionales
- **TypeScript**: Type safety completo
- **Tailwind CSS 4**: Estilos modernos y responsivos

### Backend

- **Next.js API Routes**: Endpoints seguros
- **Vercel AI SDK**: Streaming e integración con LLMs
- **OpenRouter**: Acceso a múltiples modelos LLM

## 📋 Requisitos Previos

- **Node.js 18+** y **npm**
- **Cuenta en OpenRouter**: https://openrouter.ai
- **API Key de OpenRouter**: Obtén una en https://openrouter.ai/keys

## 🚀 Instalación y Setup

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# OpenRouter API Key
OPENROUTER_API_KEY=sk-or-v1-your-actual-key-here

# OpenRouter Base URL
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1

# Modelo LLM a utilizar
OPENROUTER_MODEL=gpt-3.5-turbo
```

**⚠️ IMPORTANTE**:

- Reemplaza `sk-or-v1-your-actual-key-here` con tu API key real
- El archivo `.env.local` está en `.gitignore` y NO debe ser versionado

### 3. Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
chatbot2/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── route.ts          # Backend: Endpoint seguro
│   │   ├── globals.css               # Estilos globales
│   │   ├── layout.tsx                # Layout principal
│   │   └── page.tsx                  # Frontend: Interfaz del chat
│   └── hooks/
│       └── useChat.ts                # Hook personalizado para lógica del chat
├── .env.local                        # Variables de entorno (no versionado)
├── package.json                      # Dependencias del proyecto
├── tsconfig.json                     # Configuración de TypeScript
└── README.md                         # Este archivo
```

## 🔧 Arquitectura Técnica

### Backend - API Route (`/api/chat`)

**Características de seguridad:**

- ✅ API key solo en servidor
- ✅ Validación de inputs
- ✅ Límite de caracteres (10,000)
- ✅ Streaming de respuesta
- ✅ Manejo de errores con mensajes seguros

### Frontend - Hook `useChat`

El hook personalizado maneja:

- Estado de mensajes
- Gestión de input del usuario
- Streaming de respuestas
- Manejo de errores
- Estados de carga

### Frontend - Componente Principal

Interfaz moderna con:

- Auto-scroll a nuevos mensajes
- Indicador de typing animation
- Manejo visual de errores
- Input con validación
- Diseño responsive

## 🔐 Consideraciones de Seguridad

### ✅ Lo que está bien implementado

1. **API Keys en Backend**: Nunca se exponen al cliente
2. **Variables de Entorno**: `.env.local` en `.gitignore`
3. **Validación de Inputs**: Sanitización de caracteres y límite de tamaño
4. **Manejo de Errores**: Sin exposición de información sensible
5. **HTTPS Ready**: Compatible con HTTPS en producción

## 🎯 Cómo Usar la Aplicación

1. **Iniciar conversación**: Escribe un mensaje en el input
2. **Enviar**: Presiona "Enviar" o Enter
3. **Ver respuesta**: El bot responde en tiempo real con streaming
4. **Continuar conversación**: El historial se mantiene en la sesión
5. **Refrescar**: Al recargar la página, se borra el historial (sesión local)

## 📚 Recursos Útiles

- **Vercel AI SDK**: https://sdk.vercel.ai/
- **OpenRouter Docs**: https://openrouter.ai/docs
- **Next.js 15 Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **React Hooks**: https://react.dev/reference/react/hooks

## 🚀 Deployment

### Vercel (Recomendado)

1. Push a GitHub
2. Conecta a Vercel
3. Configura environment variables en dashboard
4. Deploy automático

En Vercel Dashboard, agrega:

```env
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
```

---

**¡Disfruta construyendo tu chatbot inteligente!** 🚀💬

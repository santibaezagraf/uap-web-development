# Instrucciones de Copilot - Chatbot Project

Este archivo contiene instrucciones personalizadas para trabajar con el proyecto Chatbot.

## 📋 Descripción del Proyecto

Chatbot inteligente con Next.js 15, Vercel AI SDK e OpenRouter. Cumple con todos los requisitos de la consigna:

- ✅ Interfaz de Chat moderna y responsiva
- ✅ Streaming de respuestas en tiempo real
- ✅ Manejo de estado de conversación
- ✅ Validación robusta de inputs
- ✅ Indicadores de carga y errores
- ✅ Seguridad: API keys solo en backend

## 🏗️ Estructura del Proyecto

```
src/
├── app/
│   ├── api/chat/route.ts     # Backend seguro
│   ├── page.tsx              # Frontend del chat
│   ├── layout.tsx            # Layout principal
│   └── globals.css           # Estilos globales
└── hooks/
    └── useChat.ts            # Hook personalizado
```

## 🚀 Comandos Principales

```bash
npm run dev      # Desarrollo local
npm run build    # Build de producción
npm run lint     # Ejecutar ESLint
npm start        # Ejecutar build de producción
```

## 🔐 Configuración de Seguridad

### Variables de Entorno Requeridas

```env
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
```

**⚠️ IMPORTANTE**:

- `.env.local` NO debe estar versionado (está en .gitignore)
- API keys NUNCA en el cliente
- Validación de inputs en el backend

## 📝 Directrices de Desarrollo

### Backend (API Routes)

- Validación de inputs estricta
- Sanitización de mensajes (máximo 10,000 caracteres)
- Manejo de errores seguro (sin exposición de keys)
- Streaming de respuestas

### Frontend (React/TypeScript)

- Componentes funcionales con hooks
- Type safety con TypeScript
- Validación del lado del cliente
- Manejo de errores visual

### Estilos

- Tailwind CSS para diseño
- Dark mode por defecto
- Responsive en todos los tamaños
- Animaciones suaves

## 🔄 Flujo de la Aplicación

1. **Usuario escribe mensaje** → Input del cliente
2. **Envío del mensaje** → POST a `/api/chat`
3. **Backend valida** → Sanitización y validación
4. **Llamada a OpenRouter** → Streaming de respuesta
5. **Actualización en tiempo real** → Frontend muestra respuesta
6. **Historial persistente** → Mantiene conversación en sesión

## 🐛 Troubleshooting

### Error: "API key not configured"

- Verifica que `.env.local` exista
- Revisa que `OPENROUTER_API_KEY` esté presente
- Reinicia `npm run dev`

### Error: "Invalid request body"

- Asegúrate que el formato de `messages` sea correcto
- Valida que sean `role` y `content`

### Respuestas lentas

- Cambia el modelo en `.env.local`
- Reduce `maxTokens` en `route.ts`

## 📚 Recursos

- Vercel AI SDK: https://sdk.vercel.ai/
- OpenRouter: https://openrouter.ai/docs
- Next.js 15: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/

## ✨ Características Implementadas

### ✅ Obligatorios

- [x] Interfaz de Chat
- [x] Streaming de Respuestas
- [x] Manejo de Estado
- [x] Validación de Inputs
- [x] Indicadores de Carga
- [x] Manejo de Errores
- [x] Seguridad de API Keys

### 🔄 Adicionales

- [x] Auto-scroll en mensajes
- [x] Typing animation
- [x] Error messages mejorados
- [x] Responsive design
- [x] TypeScript strict

## 🎯 Estado del Proyecto

**Status**: ✅ COMPLETO

Todos los requisitos de la consigna han sido implementados exitosamente.

---

_Última actualización: 30 de Octubre de 2025_

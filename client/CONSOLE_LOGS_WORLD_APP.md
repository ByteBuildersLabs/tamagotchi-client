# 📱 **CONSOLE LOGS EN WORLD APP - Mini Apps**

## 🔍 **Cómo Ver Console Logs en World App**

Según la documentación oficial de Worldcoin/MiniKit, hay varias formas de ver logs en mini apps:

### **📋 Método Principal: Eruda (Recomendado)**

La documentación oficial menciona:
> **"[Eruda](https://github.com/liriliri/eruda) is helpful showing logs on mobile"**

**Eruda** es una biblioteca de debugging para móviles que muestra una consola completa dentro de la aplicación.

#### **1. Integrar Eruda en ByteBeasts:**

```typescript
// En main.tsx o index.html - Solo para desarrollo
if (process.env.NODE_ENV === 'development' || import.meta.env.VITE_ENABLE_ERUDA) {
  import('eruda').then(eruda => eruda.default.init());
}
```

#### **2. O via CDN en index.html:**

```html
<!-- Solo para testing en World App -->
<script src="//cdn.jsdelivr.net/npm/eruda"></script>
<script>eruda.init();</script>
```

#### **3. Activar en Production para Testing:**

```bash
# Agregar environment variable
VITE_ENABLE_ERUDA=true pnpm build
```

### **🌐 Métodos Alternativos**

#### **iOS Safari Developer:**
1. **Safari > Preferences > Advanced** → "Show Develop menu"
2. **Connect iPhone via USB**
3. **Develop > [iPhone] > World App**
4. **Web Inspector** → Console

#### **Android Chrome DevTools:**
1. **Enable USB Debugging** 
2. **chrome://inspect** en Chrome desktop
3. **Inspect World App webview**

#### **Ngrok para Testing Local:**
> "Ngrok is a great tool for testing locally" - Documentación oficial

```bash
# Usar ngrok para tunnel HTTPS
ngrok http 3000
# Luego usar la URL HTTPS en World App
```

## 🚀 **Setup para ByteBeasts Deploy**

### **Opción 1: Eruda Temporal (Recomendado)**

```typescript
// Agregar a main.tsx para el deploy de testing
if (import.meta.env.VITE_ENABLE_ERUDA === 'true') {
  import('eruda').then(eruda => {
    eruda.default.init();
    console.log('🧪 Eruda activated for World App debugging');
  });
}
```

```bash
# Build con Eruda para testing en World App
VITE_ENABLE_ERUDA=true pnpm build

# Deploy normal sin logs
pnpm build
```

### **Opción 2: Logs Visible en UI (Fallback)**

```typescript
// Hook para mostrar logs en UI para debugging
const useDebugLogs = () => {
  const [logs, setLogs] = useState<string[]>([]);
  
  const addLog = (message: string) => {
    setLogs(prev => [...prev.slice(-10), `${new Date().toLocaleTimeString()}: ${message}`]);
  };
  
  return { logs, addLog };
};

// Mostrar en UI durante testing
{import.meta.env.VITE_ENABLE_DEBUG && (
  <div className="fixed bottom-0 left-0 right-0 bg-black text-green-400 text-xs p-2 max-h-32 overflow-y-auto">
    {logs.map((log, i) => <div key={i}>{log}</div>)}
  </div>
)}
```

### **Logs Importantes para ByteBeasts:**

```javascript
// Estos logs serán visibles con Eruda en World App
console.log('🎯 CHIPI WALLET STATUS:', {
  walletAddress: walletAddress,
  isConnected: isConnected,
  isInWorldApp: isInWorldApp,
  username: username
});

console.log('🔄 Executando contract call:', {
  contract: contractName,
  method: entrypoint,
  params: calldata,
  timestamp: new Date().toISOString()
});

console.log('✅ Contract call success:', {
  txHash: mockTransactionHash,
  result: 'success'
});

console.log('🔄 MIGRATION STATUS:', getMigrationInfo());
```

## 🎯 **Deploy con Eruda para Testing**

```bash
# 1. Build con Eruda habilitado
VITE_ENABLE_ERUDA=true pnpm build

# 2. Deploy con logs visibles
git add .
git commit -m "feat: deploy with Eruda console for World App testing"
git push origin feat/worldcoin-integration

# 3. Después del testing, build sin Eruda
pnpm build
git commit -m "build: remove Eruda for production"
```

## 📱 **En World App verás:**

1. **Floating debug button** (Eruda) en la esquina
2. **Tap para abrir console completa**
3. **Tabs: Console, Elements, Network, etc.**
4. **Todos los console.log visibles**
5. **Inspect elements, network requests, etc.**

¡Eruda es perfecto para debugging mini apps en World App! 🚀
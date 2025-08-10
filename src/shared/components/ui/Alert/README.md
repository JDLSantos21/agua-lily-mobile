# Sistema de Alertas Personalizado

Un sistema de alertas flexible y personalizable para React Native que funciona como las alertas nativas pero con mejor apariencia y más opciones.

## 🚀 Instalación

1. **Instalar el provider en tu app principal (ej. `_layout.tsx` o `App.tsx`):**

```tsx
import { AlertProvider, AlertComponent } from "@/shared/components/ui/Alert";

export default function RootLayout() {
  return (
    <AlertProvider>
      {/* Tu contenido de la app */}
      <Stack>{/* Tus pantallas */}</Stack>

      {/* Componente de alerta - debe estar al final */}
      <AlertComponent />
    </AlertProvider>
  );
}
```

## 📱 Uso

### Hook `useCustomAlert`

```tsx
import { useCustomAlert } from "@/shared/components/ui/Alert";

export default function MyComponent() {
  const alert = useCustomAlert();

  const handleShowInfo = () => {
    alert.show("Información", "Este es un mensaje informativo");
  };

  const handleShowSuccess = () => {
    alert.success("¡Éxito!", "La operación se completó correctamente");
  };

  const handleShowError = () => {
    alert.error("Error", "Algo salió mal, intenta de nuevo");
  };

  const handleShowWarning = () => {
    alert.warning("Advertencia", "Ten cuidado con esta acción");
  };

  const handleConfirm = () => {
    alert.confirm(
      "Confirmar acción",
      "¿Estás seguro de que quieres continuar?",
      () => console.log("Confirmado"),
      () => console.log("Cancelado")
    );
  };

  const handleDelete = () => {
    alert.confirmDestructive(
      "Eliminar elemento",
      "Esta acción no se puede deshacer",
      () => console.log("Eliminado"),
      () => console.log("Cancelado"),
      "Eliminar",
      "Cancelar"
    );
  };

  return (
    <View>
      <Button title="Mostrar Info" onPress={handleShowInfo} />
      <Button title="Mostrar Éxito" onPress={handleShowSuccess} />
      <Button title="Mostrar Error" onPress={handleShowError} />
      <Button title="Mostrar Advertencia" onPress={handleShowWarning} />
      <Button title="Confirmar" onPress={handleConfirm} />
      <Button title="Eliminar" onPress={handleDelete} />
    </View>
  );
}
```

## 🎨 Tipos de Alertas

### 1. **Información (`show`)**

- Ícono: ℹ️ Azul
- Uso: Mostrar información general

### 2. **Éxito (`success`)**

- Ícono: ✅ Verde
- Uso: Confirmar operaciones exitosas

### 3. **Error (`error`)**

- Ícono: ❌ Rojo
- Uso: Mostrar errores o problemas

### 4. **Advertencia (`warning`)**

- Ícono: ⚠️ Amarillo
- Uso: Alertar sobre posibles problemas

### 5. **Confirmación (`confirm`)**

- Ícono: ❓ Azul
- Uso: Solicitar confirmación del usuario

### 6. **Confirmación Destructiva (`confirmDestructive`)**

- Ícono: ❌ Rojo
- Uso: Confirmar acciones destructivas (eliminar, etc.)

## 🛠️ API

### Métodos disponibles:

```tsx
const alert = useCustomAlert();

// Alerta básica
alert.show(title: string, message?: string, buttons?: AlertButton[])

// Alerta de éxito
alert.success(title: string, message?: string, onPress?: () => void)

// Alerta de error
alert.error(title: string, message?: string, onPress?: () => void)

// Alerta de advertencia
alert.warning(title: string, message?: string, onPress?: () => void)

// Confirmación
alert.confirm(
  title: string,
  message?: string,
  onConfirm?: () => void,
  onCancel?: () => void,
  confirmText?: string = 'Confirmar',
  cancelText?: string = 'Cancelar'
)

// Confirmación destructiva
alert.confirmDestructive(
  title: string,
  message?: string,
  onConfirm?: () => void,
  onCancel?: () => void,
  confirmText?: string = 'Eliminar',
  cancelText?: string = 'Cancelar'
)

// Alerta personalizada
alert.custom(options: AlertOptions)

// Cerrar alerta manualmente
alert.hide()
```

### Interfaces:

```tsx
interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: "default" | "cancel" | "destructive";
}

interface AlertOptions {
  title: string;
  message?: string;
  buttons?: AlertButton[];
  type?: "info" | "success" | "warning" | "error" | "confirm";
  cancelable?: boolean;
}
```

## 🎯 Ejemplos Específicos

### Reemplazar Alert nativo de React Native:

**Antes:**

```tsx
import { Alert } from "react-native";

Alert.alert("Título", "Mensaje", [
  { text: "Cancelar", style: "cancel" },
  { text: "OK", onPress: () => console.log("OK") },
]);
```

**Después:**

```tsx
import { useCustomAlert } from "@/shared/components/ui/Alert";

const alert = useCustomAlert();

alert.confirm(
  "Título",
  "Mensaje",
  () => console.log("OK"),
  () => console.log("Cancelado")
);
```

### Guardar ubicación (tu caso de uso):

```tsx
const handleSaveLocation = () => {
  alert.confirm(
    "Guardar ubicación",
    "¿Deseas guardar la ubicación GPS actual como dirección exacta del equipo?",
    async () => {
      if (equipmentId && equipment?.data?.id) {
        await saveLocation(equipment.data.id);
      }
    }
  );
};
```

## ✨ Características

- **🎨 Diseño moderno**: Interfaces limpias con TailwindCSS
- **📱 Responsive**: Se adapta a diferentes tamaños de pantalla
- **🔧 Flexible**: Botones personalizables y múltiples tipos
- **⚡ Performante**: Context API optimizado
- **🎭 Animaciones**: Transiciones suaves con react-native-modal
- **♿ Accesible**: Compatible con lectores de pantalla
- **🔒 Type-safe**: Completamente tipado con TypeScript

# Button Component

Un componente de botón altamente personalizable y optimizado para React Native con Expo Router.

## Características

- ✅ **10 variantes** de estilo predefinidas
- ✅ **3 tamaños** diferentes (sm, md, lg)
- ✅ **Soporte para iconos** con posición configurable
- ✅ **Estados** (disabled, loading)
- ✅ **Feedback visual** mejorado (opacity + scale)
- ✅ **Navegación** integrada con Expo Router
- ✅ **Children customizados** para contenido personalizado
- ✅ **Altamente personalizable** con props adicionales
- ✅ **TypeScript** completamente tipado
- ✅ **Optimizado** para producción

## Props

### Básicas

- `onPress?: () => void` - Función ejecutada al presionar el botón
- `text?: string` - Texto del botón
- `variant?: ButtonVariant` - Variante de estilo (default: "primary")
- `size?: ButtonSize` - Tamaño del botón (default: "md")
- `disabled?: boolean` - Estado deshabilitado (default: false)
- `loading?: boolean` - Estado de carga (default: false)
- `children?: React.ReactNode` - Contenido personalizado

### Iconos

- `icon?: keyof typeof Ionicons.glyphMap` - Icono de Ionicons
- `iconPosition?: "left" | "right"` - Posición del icono (default: "left")
- `iconColor?: string` - Color personalizado del icono

### Navegación

- `href?: string` - URL para navegación con Expo Router

### Personalización

- `className?: string` - Clases CSS adicionales para el botón
- `textClassName?: string` - Clases CSS adicionales para el texto
- `pressedOpacity?: number` - Opacidad al presionar (default: 0.6)
- `fullWidth?: boolean` - Botón de ancho completo (default: false)

## Variantes

### Colores

- `primary` - Azul (default)
- `secondary` - Gris
- `success` - Verde
- `danger` - Rojo
- `warning` - Amarillo
- `info` - Cyan
- `whatsapp` - Verde WhatsApp
- `location` - Naranja

### Especiales

- `ghost` - Transparente con texto coloreado
- `outline` - Borde con fondo transparente

## Tamaños

- `sm` - Pequeño (py-2 px-3)
- `md` - Mediano (py-4 px-4) - Default
- `lg` - Grande (py-5 px-6)

## Ejemplos de Uso

### Básico

```tsx
<Button text="Click me" onPress={() => console.log("Pressed")} />
```

### Con icono

```tsx
<Button
  icon="home"
  text="Home"
  variant="primary"
  onPress={() => navigate("/")}
/>
```

### Navegación

```tsx
<Button href="/profile" text="Go to Profile" icon="person" />
```

### Personalizado

```tsx
<Button
  variant="danger"
  size="lg"
  icon="trash"
  text="Delete"
  iconPosition="right"
  pressedOpacity={0.5}
  onPress={() => handleDelete()}
/>
```

### Con children

```tsx
<Button variant="primary">
  <View className="flex-row items-center">
    <Text className="text-white font-bold">Custom</Text>
    <Text className="text-yellow-300 ml-2">Content</Text>
  </View>
</Button>
```

### Estados

```tsx
<Button text="Disabled" disabled />
<Button text="Loading" loading />
```

## Feedback Visual

El botón incluye feedback visual optimizado:

- **Opacity**: Cambia al presionar (configurable con `pressedOpacity`)
- **Scale**: Ligera reducción de tamaño al presionar (scale: 0.98)
- **Estados**: Opacidad reducida para disabled/loading

## Optimizaciones para Producción

- **Memoización**: Componente optimizado para re-renders
- **TypeScript**: Tipado completo para mejor DX
- **Accesibilidad**: Soporte para disabled y estados
- **Performance**: Uso eficiente de Pressable con feedback nativo
- **Flexibilidad**: Altamente customizable sin sacrificar performance

## Compatibilidad

- ✅ React Native
- ✅ Expo
- ✅ Expo Router
- ✅ NativeWind/Tailwind CSS
- ✅ Ionicons
- ✅ TypeScript

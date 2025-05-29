# Aplicación de Gestión de Tareas

## Descripción

Este proyecto es una aplicación de gestión de tareas con una interfaz de usuario moderna que incluye:

- Sistema de autenticación (página de login)
- Tablero principal con funcionalidades CRUD para tareas
- Filtrado y ordenamiento de tareas
- Sistema de prioridades y estados visuales
- Selector de fechas interactivo

## Características principales

### Autenticación

- Formulario de login con validación básica
- Diseño responsive con ilustración
- Validación de campos obligatorios

### Gestión de Tareas

- CRUD completo (Crear, Leer, Actualizar, Eliminar)
- Sistema de estados:
  - No iniciado
  - En curso
  - Detenido
  - Listo
- Prioridades:
  - Urgente
  - Alta
  - Media
  - Baja
  - Neutral
- Fechas con selector de calendario interactivo

### Funcionalidades avanzadas

- Búsqueda en tiempo real por nombre, estado o prioridad
- Ordenamiento por:
  - Orden original
  - Alfabético
  - Estado
  - Fecha
  - Prioridad
- Eliminación múltiple de tareas seleccionadas
- Interfaz intuitiva con efectos visuales

## Estructura de archivos

```
project/
├── login.js          # Lógica del formulario de login
├── login.css         # Estilos específicos para la página de login
├── index.js          # Lógica principal de la aplicación
├── styles.css        # Estilos principales de la aplicación
```

## Tecnologías utilizadas

- HTML5
- CSS3 (Flexbox, Grid)
- JavaScript Vanilla (ES6+)
- Diseño responsive
- Iconos y elementos visuales modernos

## Instalación y uso

1. Clonar el repositorio
2. Abrir `login.html` en un navegador moderno para acceder al sistema
3. Ingresar cualquier email y contraseña (no hay validación real)
4. Será redirigido al tablero principal de tareas

## Funcionalidades del tablero

- **Agregar tarea**: Click en "+ Agregar tarea"
- **Editar estado/prioridad/fecha**: Click en los elementos correspondientes
- **Buscar**: Escribir en el campo de búsqueda
- **Ordenar**: Click en el botón "Ordenar" para cambiar criterios
- **Eliminar**: Seleccionar tareas con checkboxes y click en "Eliminar"

## Notas

- Todos los datos se almacenan en memoria (no hay persistencia)
- La aplicación está diseñada para funcionar en navegadores modernos
- El diseño es completamente responsive

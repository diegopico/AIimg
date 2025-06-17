# Esquemas de Formularios

Esta carpeta contiene esquemas JSON predefinidos que puedes usar como base para crear nuevos formularios en la aplicación.

## Estructura de Archivos

```
form-schemas/
├── README.md
├── customer-form.schema.json    # Esquema para formulario de clientes
└── product-form.schema.json     # Esquema para formulario de productos
```

## Cómo Usar los Esquemas

1. **Copia y Adapta**: Usa estos esquemas como punto de partida para tus nuevos formularios.
2. **Personaliza**: Modifica los campos, validaciones y mensajes según tus necesidades.
3. **Mantén la Estructura**: Respeta la estructura base del esquema para asegurar compatibilidad.

## Tipos de Campos Disponibles

- `text`: Campos de texto
- `number`: Campos numéricos
- `email`: Campos de correo electrónico
- `select`: Listas desplegables
- `textarea`: Áreas de texto
- `checkbox`: Casillas de verificación
- `date`: Selectores de fecha

## Validaciones Disponibles

- `required`: Campo obligatorio
- `minLength`: Longitud mínima
- `maxLength`: Longitud máxima
- `pattern`: Patrón regex
- `email`: Formato de correo
- `min`: Valor mínimo (números)
- `max`: Valor máximo (números)

## Clases CSS Globales

Estas clases están disponibles globalmente y no necesitan ser definidas en los estilos del componente:

- `cardWithShadow`: Estilo de tarjeta con sombra
- `w-100`: Ancho 100%
- `p-24`: Padding 24px
- `row`: Fila de grid
- `col-sm-*`: Columnas responsive (1-12)
- `mt-3`: Margin top 1rem

## Ejemplo de Uso

1. Copia uno de los esquemas existentes
2. Modifica los campos según tus necesidades
3. Ajusta las validaciones y mensajes
4. Proporciona el JSON al asistente para generar el componente

## Notas Importantes

- Los campos `name` deben ser únicos en el formulario
- Las rutas de API deben comenzar con `/api/`
- Los mensajes de validación deben ser claros y descriptivos
- Las clases de grid deben sumar 12 en cada fila 
# Base Calendar (Shared)

Un calendario agnóstico y reutilizable para visualizar y administrar eventos a través de diferentes vistas (Mes, Semana, Día). Construido para reemplazar dependencias rígidas previas como `@ilamy/calendar`.

## Importación
```tsx
import { Calendar } from "@/shared/calendar/Calendar";
// Types opcionales si necesitas tipar tu lógica:
import { CalendarEvent, ViewType } from "@/shared/calendar/types";
```

## Ejemplo Básico

```tsx
const events: CalendarEvent[] = [
  { id: 1, start: "2024-04-16T10:00", end: "2024-04-16T11:00", title: "Cita" }
];

<Calendar 
  events={events}
  views={["month", "week", "day"]} // Vistas habilitadas. Por defecto ["month", "week", "day"]
  orientation="horizontal" // "horizontal" | "vertical" (Aplica para Week y Day view)
  onCellClick={(info) => console.log(info.start)}
  onEventClick={(event) => console.log(event)}
  disableCellClick={false}
/>
```

## Props de `<Calendar />`

| Prop | Tipo | Descripción |
| :--- | :--- | :--- |
| `events` | `CalendarEvent[]` | Array de eventos con `id`, `start`, `end`, `title`, etc. |
| `view` | `"month" \| "week" \| "day"` | (Controlado) Sobrescribe la vista activa actual. |
| `views` | `ViewType[]` | Arreglo de vistas permitidas a mostrar en el control. |
| `date` | `dayjs.Dayjs \| Date \| string` | (Controlado) Controla externamente la fecha vista en el calendario. |
| `orientation` | `"vertical" \| "horizontal"` | Ejes X/Y de horarios para la vista Semana y Día. |
| `onCellClick`| `(info: { start: dayjs.Dayjs }, e) => void` | Detonado al hacer click en una celda vacía o día. |
| `onEventClick`| `(event: CalendarEvent, e) => void` | Detonado al hacer click sobre un evento. |
| `renderEvent`| `(event, view) => ReactNode` | Reemplaza el recuadro por defecto de los eventos. (Custom Render). |
| `headerComponent`| `ReactNode` | Sustituye el header entero del componente (Opcional). |
| `disableCellClick`| `boolean` | Deshabilita toda interactividad (click event, click cell). |

## Consideraciones de Diseño
- Usa **Tailwind CSS** con las variables globales del proyecto (`bg-interior`, `bg-fondo-inputs`, `text-subtitulo`, `text-principal`, etc).
- **Semana/Día:** Con `orientation="horizontal"`, las horas se ven en el eje X (arriba) y los días en Y (izquierda). Con "vertical", ocurre lo inverso.
- **Sin Drag And Drop:** Esto simplifica enormemente el motor manteniendo el control en modales (como los usados en el módulo de *clinics*).
- Los eventos **en el pasado** (días anteriores a "hoy") aparecen visualmente opacados y su click es ignorado en ciertas circunstancias para evitar crear eventos históricos.

## Customización del Header Central
Puedes inyectar un `<headerComponent />` propio con un diseño distinto y consumir la API del calendario usando su contexto base:

```tsx
import { useCalendarContext } from "@/shared/calendar/CalendarContext";

function MiPropioHeader() {
  // Aquí tienes acceso total al estado y métodos del Calendario interno.
  const { nextPeriod, prevPeriod, currentDate, setView } = useCalendarContext();

  return (
    <div>
      {/* Tu lógica y UI... */}
    </div>
  )
}
```
y pasarlo al root: `<Calendar headerComponent={<MiPropioHeader />} />`

interface EmptyChartStateProps {
  height?: number;
}

export function EmptyChartState({ height = 200 }: EmptyChartStateProps) {
  return (
    <div className="flex items-center justify-center" style={{ height }}>
      <p className="text-sm text-subtitulo">Sin datos para el período seleccionado</p>
    </div>
  );
}

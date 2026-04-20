export function PatientSkeletonRow() {
    return (
        <tr className="border-b animate-pulse">
            {Array.from({ length: 7 }).map((_, i) => (
                <td key={i} className="px-5 py-3.5">
                    <div className="h-4 bg-subtitulo rounded-md" style={{ width: `${60 + i * 10}%` }} />
                </td>
            ))}
        </tr>
    );
}

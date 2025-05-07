// app/pokemon/[id]/loading.tsx
export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center h-96 text-center text-blue-500 animate-pulse">
            <p className="text-2xl font-semibold mb-4">Lade Pokémon-Daten...</p>
            <div className="w-24 h-24 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );
}

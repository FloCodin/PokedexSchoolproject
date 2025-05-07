// app/pokemon/[id]/components/SizeSection.tsx
import { Pokemon } from "../types";

export default function SizeSection({ pokemon }: { pokemon: Pokemon }) {
    return (
        <section id="size" className="mb-8">
            <h2 className="text-2xl font-semibold text-center mb-4">Größe, Gewicht und Fangrate</h2>
            <div className="text-center space-y-2">
                <p><strong>Höhe:</strong> {pokemon.height / 10} m</p>
                <p><strong>Gewicht:</strong> {pokemon.weight / 10} kg</p>
                <p><strong>Fangrate:</strong> {pokemon.captureRate}</p>
            </div>
        </section>
    );
}

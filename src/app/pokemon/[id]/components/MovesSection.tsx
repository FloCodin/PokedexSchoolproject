// app/pokemon/[id]/components/MovesSection.tsx
import { PokemonMove } from "../types";

const typeColors: Record<string, string> = {
    fire: '#F08030',
    water: '#6890F0',
    grass: '#78C850',
    electric: '#F8D030',
    psychic: '#F85888',
    ice: '#98D8D8',
    dragon: '#7038F8',
    dark: '#705848',
    fairy: '#EE99AC',
    normal: '#A8A878',
    fighting: '#C03028',
    flying: '#A890F0',
    poison: '#A040A0',
    ground: '#E0C068',
    rock: '#B8A038',
    bug: '#A8B820',
    ghost: '#705898',
    steel: '#B8B8D0',
};

export default function MovesSection({ moves }: { moves: PokemonMove[] }) {
    return (
        <section id="moves" className="mb-8">
            <h2 className="text-2xl font-semibold text-center mb-4">Attacken</h2>
            <ul className="space-y-4">
                {moves.slice(0, 10).map((move) => (
                    <li key={move.move.name} className="p-4 rounded shadow-md" style={{ backgroundColor: typeColors[move.move.type] }}>
                        <p><strong>Name:</strong> {move.move.name}</p>
                        <p><strong>Typ:</strong> <span style={{ backgroundColor: typeColors[move.move.type], color: 'white', padding: '2px 6px', borderRadius: '4px', textShadow: '0px 0px 2px black' }}>{move.move.type}</span></p>
                        <p><strong>Kraft:</strong> {move.move.power}</p>
                        <p><strong>Genauigkeit:</strong> {move.move.accuracy}</p>
                        <p><strong>PP:</strong> {move.move.pp}</p>
                        <p><strong>Priorität:</strong> {move.move.priority}</p>
                        <p><strong>Art:</strong> {move.move.damageClass}</p>
                        <p><strong>Effekt:</strong> {move.move.effect}</p>
                    </li>
                ))}
            </ul>
        </section>
    );
}
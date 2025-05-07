// app/pokemon/[id]/components/TypesSection.tsx
import { PokemonType } from "../types";

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

export default function TypesSection({ types }: { types: PokemonType[] }) {
    return (
        <section id="types" className="mb-8">
            <h2 className="text-2xl font-semibold text-center mb-4">Typen</h2>
            <div className="flex justify-center gap-2 mb-4">
                {types.map(type => (
                    <span
                        key={type.type.name}
                        style={{
                            backgroundColor: typeColors[type.type.name],
                            color: 'white',
                            padding: '6px 10px',
                            borderRadius: '4px',
                            textShadow: '0px 0px 2px black',
                        }}
                    >
            {type.type.name}
          </span>
                ))}
            </div>
        </section>
    );
}

// components/PokemonList.tsx
'use client';

import React from 'react';
import PokemonCard from './PokemonCard';

interface Pokemon {
    id: number;
    name: string;
    types: string[];
    sprites: {
        front_default: string | null;
    };
}
interface PokemonListProps {
    pokemons: Pokemon[];
}
const PokemonList: React.FC<PokemonListProps> = ({ pokemons }) => {
    return (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {pokemons.map((pokemon) => (
                <PokemonCard
                    key={pokemon.id}
                    id={pokemon.id}
                    name={pokemon.name}
                    types={pokemon.types}
                    sprite={pokemon.sprites.front_default}
                />
            ))}
        </ul>
    );
};

export default PokemonList;
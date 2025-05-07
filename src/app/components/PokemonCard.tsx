// components/PokemonCard.tsx
import React from 'react';
import Image from 'next/image';

interface PokemonCardProps {
    id: number;
    name: string;
    types: string[];
    sprite: string | null;
}

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
    steel: '#B8B8D0'
};

const PokemonCard: React.FC<PokemonCardProps> = ({ id, name, types, sprite }) => {
    return (
        <li className="text-center p-4 border rounded shadow">
            <a href={`/pokemon/${id}`} target="_blank" rel="noopener noreferrer">
                {sprite ? (
                    <Image src={sprite} alt={name} width={150} height={150} className="mx-auto mb-2" />
                ) : (
                    <p className="text-center text-gray-500">No Image Available</p>
                )}
                <p className="text-lg capitalize">{name}</p>
                <div className="flex justify-center gap-2 mt-2">
                    {types.map((type) => (
                        <span
                            key={type}
                            className="px-2 py-1 rounded"
                            style={{
                                backgroundColor: typeColors[type],
                                color: 'white',
                                textShadow: '0px 0px 2px black',
                                border: '1px solid black'
                            }}
                        >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </span>
                    ))}
                </div>
            </a>
        </li>
    );
};

export default PokemonCard;
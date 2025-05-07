// components/TypeButtonGroup.tsx
'use client';

import React from 'react';

interface TypeButtonGroupProps {
    selectedTypes: string[];
    setSelectedTypes: React.Dispatch<React.SetStateAction<string[]>>;
}

const typeColors: Record<string, string> = {
    fire: '#F08030',
    water: '#6890F0',
    grass: '#78C850',
    electric: '#f8d827',
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

const TypeButtonGroup: React.FC<TypeButtonGroupProps> = ({ selectedTypes, setSelectedTypes }) => {
    const handleTypeSelect = (type: string) => {
        setSelectedTypes(prev =>
            prev.includes(type)
                ? prev.filter(t => t !== type)
                : prev.length < 2
                    ? [...prev, type]
                    : prev
        );
    };

    return (
        <div className="flex flex-wrap gap-2 mb-4 justify-center pl-20 pr-20">
            {Object.keys(typeColors).map(type => (
                <button
                    key={type}
                    onClick={() => handleTypeSelect(type)}
                    className={`px-2 py-1 rounded ${selectedTypes.includes(type) ? 'ring-2 ring-offset-2 ring-white' : ''}`}
                    style={{
                        backgroundColor: typeColors[type],
                        color: 'white',
                        textShadow: '0px 0px 2px black',
                        border: '1px solid black',
                        minWidth: '80px',
                        maxWidth: '120px',
                        textAlign: 'center',
                        cursor: 'pointer',
                    }}
                    disabled={selectedTypes.length >= 2 && !selectedTypes.includes(type)}
                >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
            ))}
        </div>
    );
};

export default TypeButtonGroup;

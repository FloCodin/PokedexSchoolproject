// components/SearchBar.tsx
'use client';

import React from 'react';

interface SearchBarProps {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
    return (
        <input
            type="text"
            placeholder="Search Pokémon by name"
            value={value}
            onChange={onChange}
            className="w-full p-2 mb-4 border border-gray-300 rounded text-emerald-500"
        />
    );
};

export default SearchBar;
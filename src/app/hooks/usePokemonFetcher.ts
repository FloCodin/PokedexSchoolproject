// hooks/usePokemonFetcher.ts
'use client';

import { useState, useEffect, useCallback } from 'react';

export interface Pokemon {
    id: number;
    name: string;
    types: string[];
    sprites: {
        front_default: string | null;
    };
}

interface PokemonListEntry {
    name: string;
    url: string;
}

interface PokemonTypeData {
    pokemon: { pokemon: PokemonListEntry };
}

interface PokemonType {
    type: { name: string };
}

interface SpeciesName {
    language: { name: string };
    name: string;
}

export default function usePokemonFetcher() {
    const [pokemons, setPokemons] = useState<Pokemon[]>([]);
    const [filteredPokemons, setFilteredPokemons] = useState<Pokemon[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [offset, setOffset] = useState(0);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [hasMore, setHasMore] = useState(true);

    const fetchPokemon = useCallback(async (offset = 0, limit = 250) => {
        try {
            setLoading(true);
            let fetchedPokemons: PokemonListEntry[] = [];

            if (selectedTypes.length > 0) {
                for (const type of selectedTypes) {
                    const res = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
                    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                    const data = await res.json();
                    fetchedPokemons = [
                        ...fetchedPokemons,
                        ...data.pokemon.map((p: PokemonTypeData) => p.pokemon),
                    ];
                }

                fetchedPokemons = Array.from(new Set(fetchedPokemons.map(p => p.url)))
                    .map(url => fetchedPokemons.find(p => p.url === url)!) as PokemonListEntry[];

                setHasMore(false);
            } else {
                const res = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const data = await res.json();
                fetchedPokemons = data.results;

                if (data.results.length < limit) setHasMore(false);
            }

            const detailedPokemon = await Promise.all(fetchedPokemons.map(async (pokemon) => {
                const res = await fetch(pokemon.url);
                if (!res.ok) throw new Error(`Failed to fetch details for ${pokemon.name}`);
                const detailedData = await res.json();

                const speciesRes = await fetch(detailedData.species.url);
                if (!speciesRes.ok) throw new Error(`Failed to fetch species details for ${detailedData.name}`);
                const speciesData = await speciesRes.json();

                const germanName = (speciesData.names as SpeciesName[])
                    .find(name => name.language.name === 'de')?.name || detailedData.name;

                const types = (detailedData.types as PokemonType[]).map(t => t.type.name);

                return {
                    id: detailedData.id,
                    name: germanName,
                    types,
                    sprites: {
                        front_default: detailedData.sprites.front_default,
                    },
                };
            }));

            setPokemons(prev => offset === 0 ? detailedPokemon : [...prev, ...detailedPokemon]);
        } catch (err) {
            console.error('Error fetching Pokémon:', err);
        } finally {
            setLoading(false);
            setIsLoadingMore(false);
        }
    }, [selectedTypes]);

    useEffect(() => {
        setOffset(0);
        setHasMore(true);
        setPokemons([]);
        fetchPokemon(0, 100);
    }, [selectedTypes, fetchPokemon]);

    useEffect(() => {
        const filtered = pokemons.filter(p =>
            p.name.toLowerCase().includes(search.toLowerCase()) &&
            (selectedTypes.length === 0 || selectedTypes.every(type => p.types.includes(type)))
        );
        setFilteredPokemons(filtered);
    }, [search, pokemons, selectedTypes]);

    const resetTypes = () => {
        setSelectedTypes([]);
        setOffset(0);
        setHasMore(true);
        fetchPokemon(0, 250);
    };

    const loadMorePokemon = () => {
        if (hasMore && !isLoadingMore) {
            const newOffset = offset + 250;
            setOffset(newOffset);
            setIsLoadingMore(true);
            fetchPokemon(newOffset, 250);
        }
    };

    return {
        pokemons,
        filteredPokemons,
        loading,
        search,
        setSearch,
        selectedTypes,
        setSelectedTypes,
        resetTypes,
        hasMore,
        isLoadingMore,
        loadMorePokemon,
    };
}

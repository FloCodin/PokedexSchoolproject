'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";

interface PokemonListEntry {
  name: string;
  url: string;
}

interface PokemonType {
  type: {
    name: string;
  };
}

interface Pokemon {
  id: number;
  name: string;
  types: string[];
  sprites: {
    front_default: string | null;
  };
}

interface SpeciesName {
  language: {
    name: string;
  };
  name: string;
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
  steel: '#B8B8D0',
};

export default function HomePage() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [search, setSearch] = useState('');
  const [offset, setOffset] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [filteredPokemons, setFilteredPokemons] = useState<Pokemon[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const fetchPokemon = async (offset = 0, limit = 100) => {
    try {
      setLoading(true);
      let fetchedPokemons: PokemonListEntry[] = [];

      if (selectedTypes.length > 0) {
        for (const type of selectedTypes) {
          const res = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          const data = await res.json();
          fetchedPokemons = [...fetchedPokemons, ...data.pokemon.map((p: any) => p.pokemon)];
        }

        // Entferne Duplikate
        fetchedPokemons = Array.from(new Set(fetchedPokemons.map(p => p.url)))
            .map(url => fetchedPokemons.find(p => p.url === url)) as PokemonListEntry[];

        setHasMore(false); // Begrenze "Load More" bei Typ-Suche
      } else {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        fetchedPokemons = data.results;

        // Wenn weniger als limit zurückkommt, gibt’s nichts mehr
        if (data.results.length < limit) {
          setHasMore(false);
        }
      }

      const detailedPokemon = await Promise.all(fetchedPokemons.map(async (pokemon) => {
        const res = await fetch(pokemon.url);
        if (!res.ok) throw new Error(`Failed to fetch details for ${pokemon.name}`);
        const detailedData = await res.json();

        const speciesRes = await fetch(detailedData.species.url);
        if (!speciesRes.ok) throw new Error(`Failed to fetch species details for ${detailedData.name}`);
        const speciesData = await speciesRes.json();

        const germanName = (speciesData.names as SpeciesName[]).find(name => name.language.name === 'de')?.name || detailedData.name;
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
    } catch (error: any) {
      console.error('Error fetching Pokémon:', error);
      setError(error);
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    setOffset(0);
    setHasMore(true);
    setPokemons([]);
    fetchPokemon(0, 100);
  }, [selectedTypes]);

  useEffect(() => {
    const filtered = pokemons.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) &&
        (selectedTypes.length === 0 || selectedTypes.every(type => p.types.includes(type)))
    );
    setFilteredPokemons(filtered);
  }, [search, pokemons, selectedTypes]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value.toLowerCase());
  };

  const handleTypeSelect = (type: string) => {
    setSelectedTypes(prev =>
        prev.includes(type)
            ? prev.filter(t => t !== type)
            : prev.length < 2
                ? [...prev, type]
                : prev
    );
  };

  const resetTypes = () => {
    setSelectedTypes([]);
    setOffset(0);
    setHasMore(true);
    fetchPokemon(0, 100);
  };

  const loadMorePokemon = () => {
    if (hasMore && !isLoadingMore) {
      const newOffset = offset + 100;
      setOffset(newOffset);
      setIsLoadingMore(true);
      fetchPokemon(newOffset, 100);
    }
  };

  return (
      <main className="p-6 relative">
        <iframe
            className="rounded-md mb-6"
            src="https://open.spotify.com/embed/track/4es7tZLsvmqc8kpyHOtHDI?utm_source=generator&theme=0"
            width="100%"
            height="252"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
        ></iframe>

        <h1 className="text-3xl font-bold mb-4 flex justify-center">Willkommen zu Flo's Pokedex</h1>

        <input
            type="text"
            placeholder="Search Pokémon by name"
            value={search}
            onChange={handleSearch}
            className="w-full p-2 mb-4 border border-gray-300 rounded text-emerald-500"
        />

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

        <div className="mb-4 flex items-center gap-4">
          <button onClick={resetTypes} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
            Reset Types
          </button>
          <p className="text-lg">
            Aktuelle Typen Suche: {selectedTypes.length > 0 ? selectedTypes.join(' und ') : 'Keine ausgewählt'}
          </p>
        </div>

        {loading && pokemons.length === 0 ? (
            <p className="text-center text-lg text-blue-500">Loading the Pokémon list...</p>
        ) : (
            <>
              {search && filteredPokemons.length === 0 && (
                  <p className="text-center text-red-500">Keine Ergebnisse für "{search}"</p>
              )}
              <ul className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-6">
                {filteredPokemons.map((pokemon) => (
                    <li key={pokemon.id} className="text-center p-4 border rounded shadow">
                      <a href={`/pokemon/${pokemon.id}`} target="_blank" rel="noopener noreferrer">
                        {pokemon.sprites.front_default ? (
                            <Image
                                src={pokemon.sprites.front_default}
                                alt={pokemon.name}
                                width={150}
                                height={150}
                                className="mx-auto mb-2"
                            />
                        ) : (
                            <p className="text-center text-gray-500">No Image Available</p>
                        )}
                        <p className="text-lg capitalize">{pokemon.name}</p>
                        <div className="flex justify-center gap-2 mt-2">
                          {pokemon.types.map((type) => (
                              <span
                                  key={type}
                                  className="px-2 py-1 rounded"
                                  style={{
                                    backgroundColor: typeColors[type],
                                    color: 'white',
                                    textShadow: '0px 0px 2px black',
                                    border: '1px solid black',
                                  }}
                              >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </span>
                          ))}
                        </div>
                      </a>
                    </li>
                ))}
              </ul>
              {hasMore && (
                  <div className="text-center mt-4">
                    <button
                        onClick={loadMorePokemon}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        disabled={isLoadingMore}
                    >
                      {isLoadingMore ? 'Loading...' : 'Load More Pokémon'}
                    </button>
                  </div>
              )}
            </>
        )}
      </main>
  );
}

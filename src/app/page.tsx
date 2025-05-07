'use client';

import React from 'react';
import SearchBar from './components/SearchBar';
import TypeButtonGroup from './components/TypeButtonGroup';
import PokemonList from './components/PokemonList';
import LoadMoreButton from './components/LoadMoreButton';
import usePokemonFetcher from './hooks/usePokemonFetcher';

export default function HomePage() {
    const {
        pokemons,
        filteredPokemons,
        loading,
        hasMore,
        isLoadingMore,
        search,
        selectedTypes,
        setSearch,
        setSelectedTypes,
        resetTypes,
        loadMorePokemon,
    } = usePokemonFetcher();

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

            <h1 className="text-3xl font-bold mb-4 flex justify-center">Willkommen zu Flo&apos;s Pokedex</h1>

            <SearchBar
                value={search}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearch(e.target.value.toLowerCase())
                }
            />

            <TypeButtonGroup
                selectedTypes={selectedTypes}
                setSelectedTypes={setSelectedTypes}
            />

            <div className="mb-4 flex items-center gap-4">
                <button
                    onClick={resetTypes}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Reset Types
                </button>
                <p className="text-lg">
                    Aktuelle Typen Suche:{" "}
                    {selectedTypes.length > 0 ? selectedTypes.join(" und ") : "Keine ausgewählt"}
                </p>
            </div>

            {loading && pokemons.length === 0 ? (
                <p className="text-center text-lg text-blue-500">Loading the Pokémon list...</p>
            ) : (
                <>
                    {search && filteredPokemons.length === 0 && (
                        <p className="text-center text-red-500">
                            Keine Ergebnisse für &quot;{search}&quot;
                        </p>
                    )}

                    <PokemonList pokemons={filteredPokemons} />

                    {hasMore && (
                        <LoadMoreButton
                            onClick={loadMorePokemon}
                            isLoading={isLoadingMore}
                        />
                    )}
                </>
            )}
        </main>
    );
}

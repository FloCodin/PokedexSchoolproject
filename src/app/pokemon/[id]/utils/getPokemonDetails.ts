// app/pokemon/[id]/utils/getPokemonDetails.ts
"use server"
import { NamedAPIResource, Pokemon, EvolutionStage } from "../types";

interface EvolutionChainLink {
    species: NamedAPIResource;
    evolves_to: EvolutionChainLink[];
    evolution_details: EvolutionDetail[];
}

interface EvolutionDetail {
    min_level?: number;
    item?: NamedAPIResource;
    trigger: { name: string };
    time_of_day?: string;
    known_move_type?: NamedAPIResource;
    location?: NamedAPIResource;
    min_happiness?: number;
}

function extractIdFromSpeciesUrl(url: string): number {
    const match = url.match(/\/pokemon-species\/(\d+)\//);
    return match ? parseInt(match[1], 10) : 0;
}

export async function getPokemonDetails(id: string): Promise<Pokemon> {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`,  {cache: 'force-cache', next: {revalidate: 3600}});
    if (!res.ok) throw new Error(`Fehler beim Abrufen des Pokémon mit der ID: ${id}`);
    const pokemonData = await res.json();

    const speciesRes = await fetch(pokemonData.species.url);
    const speciesData = await speciesRes.json();
    const germanName = speciesData.names.find((name: { language: NamedAPIResource }) => name.language.name === 'de')?.name || pokemonData.name;

    const evolutionChainRes = await fetch(speciesData.evolution_chain.url);
    const evolutionChainData = await evolutionChainRes.json();

    const parseEvolutionChain = async (chain: EvolutionChainLink): Promise<EvolutionStage[]> => {
        const evolutionDetails: EvolutionStage[] = [];
        let currentChain: EvolutionChainLink | undefined = chain;

        while (currentChain) {
            const speciesUrl = currentChain.species.url.replace('pokemon-species', 'pokemon');
            const res = await fetch(speciesUrl);
            const data = await res.json();

            const speciesRes = await fetch(currentChain.species.url);
            const speciesData = await speciesRes.json();
            const germanEvolutionName = speciesData.names.find((name: { language: NamedAPIResource }) => name.language.name === 'de')?.name || currentChain.species.name;

            const evolvesTo = await Promise.all(currentChain.evolves_to.map(async (evo: EvolutionChainLink) => {
                const evoSpeciesRes = await fetch(evo.species.url);
                const evoSpeciesData = await evoSpeciesRes.json();
                const evoGermanName = evoSpeciesData.names.find((name: { language: NamedAPIResource }) => name.language.name === 'de')?.name || evo.species.name;

                const evoPokemonRes = await fetch(evo.species.url.replace('pokemon-species', 'pokemon'));
                const evoPokemonData = await evoPokemonRes.json();

                const evolutionDetails = evo.evolution_details[0];
                let condition = 'Unbekannte Bedingung';

                if (evolutionDetails) {
                    if (evolutionDetails.min_level) {
                        condition = `Level ${evolutionDetails.min_level}`;
                    } else if (evolutionDetails.item) {
                        const itemRes = await fetch(evolutionDetails.item.url);
                        const itemData = await itemRes.json();
                        const germanItemName = itemData.names.find((name: { language: NamedAPIResource }) => name.language.name === 'de')?.name || itemData.name;
                        condition = `mit ${germanItemName}`;
                    } else if (evolutionDetails.trigger.name === 'trade') {
                        condition = 'Tausch';
                    } else if (evolutionDetails.trigger.name === 'level-up') {
                        if (evolutionDetails.time_of_day) {
                            condition = `Level-Up am ${evolutionDetails.time_of_day === 'day' ? 'Tag' : 'Nacht'}`;
                        } else if (evolutionDetails.known_move_type) {
                            const moveTypeRes = await fetch(evolutionDetails.known_move_type.url);
                            const moveTypeData = await moveTypeRes.json();
                            condition = `Level-Up mit bekanntem ${moveTypeData.names.find((name: { language: NamedAPIResource }) => name.language.name === 'de')?.name || moveTypeData.name} Attacke`;
                        } else if (evolutionDetails.location) {
                            const locationRes = await fetch(evolutionDetails.location.url);
                            const locationData = await locationRes.json();
                            condition = `Level-Up an ${locationData.names.find((name: { language: NamedAPIResource }) => name.language.name === 'de')?.name || locationData.name}`;
                        } else if (evolutionDetails.min_happiness) {
                            condition = 'mit hoher Freundschaft';
                        }
                    }
                }

                return {
                    id: extractIdFromSpeciesUrl(evo.species.url),
                    name: evoGermanName,
                    sprite: evoPokemonData.sprites.front_default,
                    condition,
                };
            }));

            evolutionDetails.push({
                id: extractIdFromSpeciesUrl(currentChain.species.url),
                name: germanEvolutionName,
                sprite: data.sprites.front_default,
                evolvesTo,
            });

            currentChain = currentChain.evolves_to[0];
        }

        return evolutionDetails;
    };

    const evolutionChain = await parseEvolutionChain(evolutionChainData.chain);

    const germanAbilities = await Promise.all(pokemonData.abilities.map(async (ability: { ability: NamedAPIResource }) => {
        const res = await fetch(ability.ability.url);
        const data = await res.json();
        const germanName = data.names.find((name: { language: NamedAPIResource }) => name.language.name === 'de')?.name || ability.ability.name;
        return { ...ability, ability: { ...ability.ability, name: germanName } };
    }));

    const germanMoves = await Promise.all(pokemonData.moves.map(async (move: { move: NamedAPIResource }) => {
        const res = await fetch(move.move.url);
        const moveData = await res.json();
        const germanName = moveData.names.find((name: { language: NamedAPIResource }) => name.language.name === 'de')?.name || move.move.name;

        const type = moveData.type.name;
        const power = moveData.power ?? 'N/A';
        const accuracy = moveData.accuracy ?? 'N/A';
        const pp = moveData.pp;
        const priority = moveData.priority ?? 0;
        const damageClass = moveData.damage_class.name;
        const effect = moveData.effect_entries.find((e: { language: NamedAPIResource }) => e.language.name === 'de')?.short_effect ||
            moveData.effect_entries.find((e: { language: NamedAPIResource }) => e.language.name === 'de')?.short_effect ||
            'Kein Effekt verfügbar';

        return {
            ...move,
            move: { ...move.move, name: germanName, type, power, accuracy, pp, priority, damageClass, effect },
        };
    }));

    return {
        name: germanName,
        height: pokemonData.height,
        weight: pokemonData.weight,
        abilities: germanAbilities,
        moves: germanMoves,
        stats: pokemonData.stats,
        types: pokemonData.types,
        sprites: pokemonData.sprites,
        captureRate: speciesData.capture_rate,
        evolutionChain,
        baseStatTotal: pokemonData.stats.reduce((sum: number, stat: { base_stat: number }) => sum + stat.base_stat, 0),
    };
}

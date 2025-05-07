import Image from "next/image";
import Link from "next/link";

interface NamedAPIResource {
    name: string;
    url: string;
}

interface PokemonAbility {
    is_hidden: boolean;
    slot: number;
    ability: NamedAPIResource;
}

interface PokemonMove {
    move: NamedAPIResource;
}

interface PokemonStat {
    base_stat: number;
    effort: number;
    stat: NamedAPIResource;
}

interface PokemonType {
    slot: number;
    type: NamedAPIResource;
}

interface Pokemon {
    name: string;
    height: number;
    weight: number;
    abilities: PokemonAbility[];
    moves: PokemonMove[];
    stats: PokemonStat[];
    types: PokemonType[];
    sprites: {
        front_default: string;
        front_shiny: string;
    };
    species: NamedAPIResource;
    forms: NamedAPIResource[];
}

interface PokemonSpecies {
    name: string;
    capture_rate: number;
    evolution_chain: { url: string };
    names: { name: string; language: NamedAPIResource }[];
}

interface EvolutionStage {
    name: string;
    sprite: string;
    evolvesTo: {
        name: string;
        sprite: string;
        condition: string;
    }[];
}

interface EvolutionChainNode {
    species: NamedAPIResource;
    evolves_to: EvolutionChainNode[];
    evolution_details: EvolutionDetail[];
}

interface EvolutionDetail {
    min_level?: number;
    item?: NamedAPIResource;
    trigger: NamedAPIResource;
    time_of_day?: string;
    known_move_type?: NamedAPIResource;
    location?: NamedAPIResource;
    min_happiness?: number;
}

interface MoveEffectEntry {
    language: NamedAPIResource;
    short_effect: string;
}

interface MoveData {
    names: { name: string; language: NamedAPIResource }[];
    type: NamedAPIResource;
    power: number | null;
    accuracy: number | null;
    pp: number;
    priority: number;
    damage_class: NamedAPIResource;
    effect_entries: MoveEffectEntry[];
}
interface PageProps {
    params: {
        id: string;
    };
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

async function getPokemonDetails(id: string) {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!res.ok) throw new Error(`Fehler beim Abrufen des Pokémon mit der ID: ${id}`);
    const pokemonData: Pokemon = await res.json();

    const speciesRes = await fetch(pokemonData.species.url);
    if (!speciesRes.ok) throw new Error(`Fehler beim Abrufen der Speziesdetails für das Pokémon mit der ID: ${id}`);
    const speciesData: PokemonSpecies = await speciesRes.json();

    const germanName = speciesData.names.find((name) => name.language.name === 'de')?.name || pokemonData.name;

    const formsData = await Promise.all(pokemonData.forms.map(async (form) => {
        const formRes = await fetch(form.url);
        if (!formRes.ok) throw new Error(`Fehler beim Abrufen der Formdetails für ${form.name}`);
        const formData = await formRes.json();
        const germanFormName = formData.names.find((name: { language: NamedAPIResource }) => name.language.name === 'de')?.name || formData.name;
        return { ...formData, name: germanFormName };
    }));

    const evolutionChainRes = await fetch(speciesData.evolution_chain.url);
    if (!evolutionChainRes.ok) throw new Error(`Fehler beim Abrufen der Evolutionskette`);
    const evolutionChainData = await evolutionChainRes.json();

    const parseEvolutionChain = async (chain: EvolutionChainNode): Promise<EvolutionStage[]> => {
        const evolutionDetails: EvolutionStage[] = [];
        let currentChain: EvolutionChainNode | undefined = chain;

        while (currentChain) {
            const speciesUrl = currentChain.species.url.replace('pokemon-species', 'pokemon');
            const res = await fetch(speciesUrl);
            const data = await res.json();

            const speciesRes = await fetch(currentChain.species.url);
            const speciesData = await speciesRes.json();
            const germanEvolutionName = speciesData.names.find((name: { language: NamedAPIResource }) => name.language.name === 'de')?.name || currentChain.species.name;

            const evolvesTo = await Promise.all(currentChain.evolves_to.map(async (evo: EvolutionChainNode) => {
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
                    name: evoGermanName,
                    sprite: evoPokemonData.sprites.front_default,
                    condition,
                };
            }));

            evolutionDetails.push({
                name: germanEvolutionName,
                sprite: data.sprites.front_default,
                evolvesTo,
            });

            currentChain = currentChain.evolves_to[0];
        }

        return evolutionDetails;
    };

    const evolutionChain = await parseEvolutionChain(evolutionChainData.chain);

    const germanAbilities = await Promise.all(pokemonData.abilities.map(async (ability) => {
        const abilityRes = await fetch(ability.ability.url);
        if (!abilityRes.ok) throw new Error(`Fehler beim Abrufen der Fähigkeitsdetails für ${ability.ability.name}`);
        const abilityData = await abilityRes.json();
        const germanAbilityName = abilityData.names.find((name: { language: NamedAPIResource }) => name.language.name === 'de')?.name || ability.ability.name;
        return { ...ability, ability: { ...ability.ability, name: germanAbilityName } };
    }));

    const germanMoves = await Promise.all(pokemonData.moves.map(async (move) => {
        const moveRes = await fetch(move.move.url);
        if (!moveRes.ok) throw new Error(`Fehler beim Abrufen der Attackendetails für ${move.move.name}`);
        const moveData: MoveData = await moveRes.json();
        const germanMoveName = moveData.names.find((name) => name.language.name === 'de')?.name || move.move.name;

        const type = moveData.type.name;
        const power = moveData.power || 'N/A';
        const accuracy = moveData.accuracy || 'N/A';
        const pp = moveData.pp;
        const priority = moveData.priority || 0;
        const damageClass = moveData.damage_class.name;

        const effect = moveData.effect_entries.find((entry) => entry.language.name === 'de')?.short_effect ||
            moveData.effect_entries.find((entry) => entry.language.name === 'en')?.short_effect ||
            'Kein Effekt verfügbar';

        return {
            ...move,
            move: {
                ...move.move,
                name: germanMoveName,
                type,
                power,
                accuracy,
                pp,
                priority,
                damageClass,
                effect,
            },
        };
    }));

    const baseStatTotal = pokemonData.stats.reduce((total, stat) => total + stat.base_stat, 0);
    const captureRate = speciesData.capture_rate;

    return {
        ...pokemonData,
        name: germanName,
        abilities: germanAbilities,
        moves: germanMoves,
        baseStatTotal,
        captureRate,
        forms: formsData,
        evolutionChain,
    };
}


export default async function PokemonDetailsPage({ params }: PageProps) {
    const pokemon = await getPokemonDetails(params.id);


    return (
        <main className="p-6 max-w-3xl mx-auto">
            <nav className="mb-6 sticky top-0 bg-white z-10">
                <ul className="flex justify-around p-2 bg-gray-100 rounded shadow-md">
                    <li><a href="#stats" className="text-blue-600 hover:underline">Basiswerte</a></li>
                    <li><a href="#abilities" className="text-blue-600 hover:underline">Fähigkeiten</a></li>
                    <li><a href="#moves" className="text-blue-600 hover:underline">Attacken</a></li>
                    <li><a href="#types" className="text-blue-600 hover:underline">Typen</a></li>
                    <li><a href="#size" className="text-blue-600 hover:underline">Größe & Gewicht</a></li>
                    <li><a href="#forms" className="text-blue-600 hover:underline">Formen</a></li>
                    <li><a href="#evolution" className="text-blue-600 hover:underline">Entwicklung</a></li>
                </ul>
            </nav>

            <h1 className="text-3xl font-bold mb-4 capitalize text-center">{pokemon.name}</h1>
            <div className="flex justify-center mb-4">
                <Image src={pokemon.sprites.front_default} alt={`Normales ${pokemon.name}`} width={250} height={250} />
            </div>

            <section id="size" className="mb-8">
                <h2 className="text-2xl font-semibold text-center mb-4">Größe, Gewicht und Fangrate</h2>
                <div className="text-center space-y-2">
                    <p><strong>Höhe:</strong> {pokemon.height / 10} m</p>
                    <p><strong>Gewicht:</strong> {pokemon.weight / 10} kg</p>
                    <p><strong>Fangrate:</strong> {pokemon.captureRate}</p>
                </div>
            </section>

            <section id="stats" className="mb-8">
                <h2 className="text-2xl font-semibold text-center mb-4">Basiswerte</h2>
                <ul className="space-y-2">
                    {pokemon.stats.map((stat: PokemonStat) => (
                        <li key={stat.stat.name} className="capitalize flex items-center">
                            <span className="w-24">{stat.stat.name}</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-4 ml-4">
                                <div className="bg-green-500 h-4 rounded-full" style={{ width: `${stat.base_stat / 2}%` }}></div>
                            </div>
                            <span className="ml-4">{stat.base_stat}</span>
                        </li>
                    ))}
                    <li className="capitalize flex items-center">
                        <span className="w-24 font-bold">Gesamt</span>
                        <span className="ml-auto">{pokemon.baseStatTotal}</span>
                    </li>
                </ul>
            </section>

            <section id="abilities" className="mb-8">
                <h2 className="text-2xl font-semibold text-center mb-4">Fähigkeiten</h2>
                <ul className="list-disc pl-6">
                    {pokemon.abilities.map((ability: PokemonAbility) => (
                        <li key={ability.ability.name} className="capitalize">
                            {ability.ability.name}
                        </li>
                    ))}
                </ul>
            </section>

            <section id="moves" className="mb-8">
                <h2 className="text-2xl font-semibold text-center mb-4">Attacken</h2>
                <ul className="space-y-4">
                    {pokemon.moves.slice(0, 10).map((move: {
                        move: {
                            name: string;
                            type: string;
                            power: number | string;
                            accuracy: number | string;
                            pp: number;
                            priority: number;
                            damageClass: string;
                            effect: string;
                        };
                    }) => (
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

            <section id="types" className="mb-8">
                <h2 className="text-2xl font-semibold text-center mb-4">Typen</h2>
                <div className="flex justify-center gap-2 mb-4">
                    {pokemon.types.map((type: PokemonType) => (
                        <span key={type.type.name} style={{ backgroundColor: typeColors[type.type.name], color: 'white', padding: '6px 10px', borderRadius: '4px', textShadow: '0px 0px 2px black' }}>
                            {type.type.name}
                        </span>
                    ))}
                </div>
            </section>

            <section id="forms" className="mb-8">
                <h2 className="text-2xl font-semibold text-center mb-4">Formen</h2>
                <div className="flex justify-center mb-4">
                    <Image src={pokemon.sprites.front_default} alt={`Normales ${pokemon.name}`} width={250} height={250} className="mx-2" />
                    <Image src={pokemon.sprites.front_shiny} alt={`Shiny ${pokemon.name}`} width={250} height={250} className="mx-2" />
                </div>

            </section>

            <section id="evolution" className="mb-8">
                <h2 className="text-2xl font-semibold text-center mb-4">Entwicklungsreihe</h2>
                <ul className="list-disc pl-6">
                    {pokemon.evolutionChain.map((evolution: EvolutionStage, index: number) => (
                        <li key={index} className="mb-4">
                            <div className="flex items-center">
                                <Link href={`/pokemon/${evolution.name}`} className="text-blue-600 hover:underline capitalize">
                                    {evolution.name}
                                </Link>
                                {evolution.sprite && (
                                    <Image src={evolution.sprite} alt={evolution.name} width={100} height={100} className="inline-block ml-2" />
                                )}
                            </div>
                            {evolution.evolvesTo.length > 0 && (
                                <div className="pl-4">
                                    <p className="text-gray-600">Weiterentwicklung:</p>
                                    {evolution.evolvesTo.map((nextEvo: { name: string; sprite: string; condition: string }, i: number) => (

                                        <div key={i} className="flex items-center">
                                            <Link href={`/pokemon/${nextEvo.name}`} className="text-blue-600 hover:underline capitalize">
                                                {nextEvo.name}
                                            </Link>
                                            {nextEvo.sprite && (
                                                <Image src={nextEvo.sprite} alt={nextEvo.name} width={100} height={100} className="inline-block ml-2" />
                                            )}
                                            <p className="text-gray-500 ml-2">{nextEvo.condition}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </section>
        </main>
    );
}
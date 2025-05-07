// app/pokemon/[id]/types.ts

export interface NamedAPIResource {
    name: string;
    url: string;
}

export interface PokemonStat {
    base_stat: number;
    stat: NamedAPIResource;
}

export interface PokemonAbility {
    ability: NamedAPIResource;
}

export interface PokemonMove {
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
}

export interface PokemonType {
    type: NamedAPIResource;
}

export interface Pokemon {
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
    captureRate: number;
    evolutionChain: EvolutionStage[];
    baseStatTotal: number;
}

export interface EvolutionStage {
    name: string;
    id: number;
    sprite: string;
    evolvesTo: {
        name: string;
        sprite: string;
        condition: string;
    }[];
}

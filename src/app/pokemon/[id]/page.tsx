// app/pokemon/[id]/page.tsx
import { getPokemonDetails } from "./utils/getPokemonDetails";
import StatsSection from "./components/StatsSection";
import AbilitiesSection from "./components/AbilitiesSection";
import MovesSection from "./components/MovesSection";
import TypesSection from "./components/TypesSection";
import SizeSection from "./components/SizeSection";
import FormsSection from "./components/FormsSection";
import EvolutionSection from "./components/EvolutionSection";
import Image from "next/image";

export default async function Page({ params }: { params: { id: string } }) {
    const pokemon = await getPokemonDetails(params.id);

    return (
        <main className="p-6 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-4 capitalize text-center">{pokemon.name}</h1>
            <div className="flex justify-center mb-4">
                <Image src={pokemon.sprites.front_default} alt={`Normales ${pokemon.name}`} width={250} height={250} />
            </div>

            <SizeSection pokemon={pokemon} />
            <StatsSection stats={pokemon.stats} baseStatTotal={pokemon.baseStatTotal} />
            <AbilitiesSection abilities={pokemon.abilities} />
            <MovesSection moves={pokemon.moves} />
            <TypesSection types={pokemon.types} />
            <FormsSection sprites={pokemon.sprites} />
            <EvolutionSection chain={pokemon.evolutionChain} />
        </main>
    );
}

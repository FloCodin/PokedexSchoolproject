// app/pokemon/[id]/components/AbilitiesSection.tsx
import { PokemonAbility } from "../types";

export default function AbilitiesSection({ abilities }: { abilities: PokemonAbility[] }) {
    return (
        <section id="abilities" className="mb-8">
            <h2 className="text-2xl font-semibold text-center mb-4">Fähigkeiten</h2>
            <ul className="list-disc pl-6">
                {abilities.map((ability) => (
                    <li key={ability.ability.name} className="capitalize">
                        {ability.ability.name}
                    </li>
                ))}
            </ul>
        </section>
    );
}
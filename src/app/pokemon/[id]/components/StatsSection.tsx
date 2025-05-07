// app/pokemon/[id]/components/StatsSection.tsx
import { PokemonStat } from "../types";

export default function StatsSection({ stats, baseStatTotal }: { stats: PokemonStat[]; baseStatTotal: number }) {
    return (
        <section id="stats" className="mb-8">
            <h2 className="text-2xl font-semibold text-center mb-4">Basiswerte</h2>
            <ul className="space-y-2">
                {stats.map((stat) => (
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
                    <span className="ml-auto">{baseStatTotal}</span>
                </li>
            </ul>
        </section>
    );
}

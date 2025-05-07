// app/pokemon/[id]/components/EvolutionSection.tsx
import Image from "next/image";
import Link from "next/link";
import type { EvolutionStage } from "../types"; // ODER "../../types"



export default function EvolutionSection({ chain }: { chain: EvolutionStage[] }) {
    return (
        <section id="evolution" className="mb-8">
            <h2 className="text-2xl font-semibold text-center mb-4">Entwicklungsreihe</h2>
            <ul className="list-disc pl-6">
                {chain.map((evolution, index) => (
                    <li key={index} className="mb-4">
                        <div className="flex items-center">
                            <Link href={`/pokemon/${evolution.id}`} className="text-blue-600 hover:underline capitalize">
                                {evolution.name}
                            </Link>
                            {evolution.sprite && (
                                <Image src={evolution.sprite} alt={evolution.name} width={100} height={100} className="inline-block ml-2" />
                            )}
                        </div>
                        {evolution.evolvesTo.length > 0 && (
                            <div className="pl-4">
                                <p className="text-gray-600">Weiterentwicklung:</p>
                                {evolution.evolvesTo.map((nextEvo, i) => (
                                    <div key={i} className="flex items-center">
                                        <Link href={`/pokemon/${nextEvo.id}`} className="text-blue-600 hover:underline capitalize">
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
    );
}

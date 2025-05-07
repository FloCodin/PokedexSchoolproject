// app/pokemon/[id]/components/FormsSection.tsx
import Image from "next/image";

interface FormsSectionProps {
    sprites: {
        front_default: string;
        front_shiny: string;
    };
}

export default function FormsSection({ sprites }: FormsSectionProps) {
    return (
        <section id="forms" className="mb-8">
            <h2 className="text-2xl font-semibold text-center mb-4">Formen</h2>
            <div className="flex justify-center mb-4">
                <Image src={sprites.front_default} alt="Normales Pokémon" width={250} height={250} className="mx-2" />
                <Image src={sprites.front_shiny} alt="Shiny Pokémon" width={250} height={250} className="mx-2" />
            </div>
        </section>
    );
}
export default async function PokemonPage() {
    const res = await fetch('https://pokeapi.co/api/v2/pokemon');
    const data = await res.json();

    return (
        <div>
            <h1>Pokemon List</h1>
            <ul>
                {data.results.map((pokemon: { name: string }, index: number) => (
                    <li key={index}>{pokemon.name}</li>
                ))}

            </ul>
        </div>
    );
}
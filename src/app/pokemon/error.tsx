// app/pokemon/error.js
'use client'; // Fehlerkomponenten müssen Client Components sein

export default function Error({ error, reset }) {
    return (
        <div>
            <p>Error: {error.message}</p>
            <button onClick={() => reset()}>Try again</button>
        </div>
    );
}
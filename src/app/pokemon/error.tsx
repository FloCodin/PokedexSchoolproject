// app/pokemon/error.tsx
'use client';

import { useEffect } from 'react';

interface ErrorProps {
    error: Error;
    reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="p-6 text-center text-red-600">
            <h2 className="text-xl font-bold mb-4">Ein Fehler ist aufgetreten!</h2>
            <p className="mb-4">{error.message}</p>
            <button
                onClick={() => reset()}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
                Erneut versuchen
            </button>
        </div>
    );
}

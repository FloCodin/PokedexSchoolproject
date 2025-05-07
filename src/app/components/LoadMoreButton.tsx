// components/LoadMoreButton.tsx
'use client';

import React from 'react';

interface LoadMoreButtonProps {
    onClick: () => void;
    isLoading: boolean;
}

const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({ onClick, isLoading }) => {
    return (
        <div className="text-center mt-4">
            <button
                onClick={onClick}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={isLoading}
            >
                {isLoading ? 'Loading...' : 'Load More Pokémon'}
            </button>
        </div>
    );
};

export default LoadMoreButton;
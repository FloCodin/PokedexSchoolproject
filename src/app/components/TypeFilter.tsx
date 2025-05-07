// components/TypeFilter.tsx
import React from "react";

interface TypeFilterProps {
    selectedTypes: string[];
    onSelect: (type: string) => void;
    typeColors: Record<string, string>;
}

const TypeFilter: React.FC<TypeFilterProps> = ({ selectedTypes, onSelect, typeColors }) => {
    return (
        <div className="flex flex-wrap gap-2 mb-4 justify-center pl-20 pr-20">
            {Object.keys(typeColors).map((type) => (
                <button
                    key={type}
                    onClick={() => onSelect(type)}
                    className={`px-2 py-1 rounded ${selectedTypes.includes(type) ? "ring-2 ring-offset-2 ring-white" : ""}`}
                    style={{
                        backgroundColor: typeColors[type],
                        color: "white",
                        textShadow: "0px 0px 2px black",
                        border: "1px solid black",
                        minWidth: "80px",
                        maxWidth: "120px",
                        textAlign: "center",
                        cursor: "pointer",
                    }}
                    disabled={selectedTypes.length >= 2 && !selectedTypes.includes(type)}
                >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
            ))}
        </div>
    );
};

export default TypeFilter;
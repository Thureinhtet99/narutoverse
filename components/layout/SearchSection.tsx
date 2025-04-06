// components/search-section.tsx
"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_CONFIG } from "@/configs/apiConfig";

// Define the character type
type Character = {
  id: string;
  name: string;
  images: string[];
  jutsu: string[];
  personal: {
    classification: string;
    clan: string;
    affiliation: string;
  };
};

export default function SearchSection() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["characters", searchTerm],
    queryFn: async () => {
      const response = await axios.get(
        `${API_CONFIG.BASE_URL}${API_CONFIG.CHARACTERS}`,
        {
          params: {
            limit: 20,
            ...(searchTerm && { name: searchTerm }),
          },
        }
      );
      return response.data;
    },
    enabled: !!searchTerm, // Only run the query if there's a search term
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="w-full max-w-2xl relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>
        <Input
          type="search"
          placeholder="Search for characters, clans, villages..."
          className="w-full pl-10 py-6 border-orange-200 dark:border-orange-800/40 focus-visible:ring-orange-500 bg-white dark:bg-gray-950 shadow-md"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Popular searches */}
      <div className="mt-2 flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => setSearchTerm("Naruto Uzumaki")}
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-800/40 transition-colors"
        >
          Naruto Uzumaki
        </button>
        <button
          onClick={() => setSearchTerm("Uchiha")}
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-800/40 transition-colors"
        >
          Uchiha Clan
        </button>
        <button
          onClick={() => setSearchTerm("Hidden Leaf")}
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-800/40 transition-colors"
        >
          Hidden Leaf
        </button>
        <button
          onClick={() => setSearchTerm("Akatsuki")}
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-800/40 transition-colors"
        >
          Akatsuki
        </button>
      </div>

      {/* Search results - only show if there's data */}
      {searchTerm && (
        <div className="mt-6 w-full">
          {isLoading && <p className="text-center">Loading...</p>}
          {error && (
            <p className="text-center text-red-500">Error fetching data</p>
          )}
          {data?.characters && data.characters.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {data.characters.map((character: Character) => (
                <div
                  key={character.id}
                  className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
                >
                  <h3 className="font-medium text-orange-600 dark:text-orange-400">
                    {character.name}
                  </h3>
                  {character.personal && (
                    <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {character.personal.clan && (
                        <p>Clan: {character.personal.clan}</p>
                      )}
                      {character.personal.affiliation && (
                        <p>Village: {character.personal.affiliation}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            searchTerm &&
            !isLoading && <p className="text-center">No characters found</p>
          )}
        </div>
      )}
    </div>
  );
}

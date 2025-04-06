import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { usePathname } from "next/navigation";

interface HeroSectionType {
  query: string;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function HeroSection({ query, handleSearch }: HeroSectionType) {
  const pathname = usePathname();

  return (
    <>
      <div className="flex flex-col items-center justify-center text-center space-y-8">
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-orange-600 dark:text-orange-400">
            Explore the Naruto Universe
          </h1>
          <p className="text-lg text-muted-foreground max-w-[42rem] mx-auto">
            Discover characters, clans, villages, and more from the world of
            Naruto.
          </p>
        </div>

        {/* Search section (client component) */}
        <div className="w-full max-w-2xl relative">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <Input
              type="search"
              placeholder={`Search for ${
                pathname === "/" ? "characters" : pathname.slice(1)
              }....`}
              className="w-full pl-10 py-6 border-orange-200 dark:border-orange-800/40 focus-visible:ring-orange-500 bg-white dark:bg-gray-950 shadow-md"
              value={query}
              onChange={handleSearch}
            />
          </div>
        </div>
      </div>
    </>
  );
}

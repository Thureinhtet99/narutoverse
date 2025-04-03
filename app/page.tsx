import NarutoCards from "@/components/naruto-cards";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <>
      <div className="space-y-10">
        {/* Hero section with search */}
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

          {/* Search bar */}
          <div className="w-full max-w-2xl relative">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <Input
                type="search"
                placeholder="Search for characters, clans, villages..."
                className="w-full pl-10 py-6 border-orange-200 dark:border-orange-800/40 focus-visible:ring-orange-500 bg-white dark:bg-gray-950 shadow-md"
              />
            </div>
            <div className="mt-2 flex flex-wrap gap-2 justify-center">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                Naruto Uzumaki
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                Uchiha Clan
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                Hidden Leaf
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                Akatsuki
              </span>
            </div>
          </div>
        </div>

        {/* Cards section */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Browse Categories</h2>
          <NarutoCards />
        </div>
      </div>
    </>
  );
}

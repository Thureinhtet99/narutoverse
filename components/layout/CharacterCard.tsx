import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import defaultImage from "@/public/images/default-image.webp";
import { Skeleton } from "../ui/skeleton";
import { usePathname } from "next/navigation";
import { CharacterType } from "@/types/index";

type CharacterCardsType = {
  data?: CharacterType[];
  loading?: boolean;
};

export default function CharacterCard({ loading, data }: CharacterCardsType) {
  const pathName = usePathname();

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No character available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {data.map((character) => (
        <Link
          href={`/${pathName.slice(1)}/${character.id}`}
          key={character.id}
          className="block h-full"
        >
          <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group border-orange-100 dark:border-orange-900/40">
            <div className="relative h-52 w-full overflow-hidden">
              {loading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 animate-pulse">
                  <Skeleton className="h-full w-full" />
                </div>
              ) : character.images && character.images[0] ? (
                <Image
                  src={character.images[0]}
                  alt={character.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <Image
                  src={defaultImage}
                  alt={character.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              {/* Character name overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="text-lg font-bold line-clamp-1">
                  {character.name}
                </h3>
                {character.personal?.clan && (
                  <p className="text-sm text-white/80">
                    {character.personal.clan}
                  </p>
                )}
                {character.personal?.species && (
                  <p className="text-sm text-white/80">
                    {character.personal.species}
                  </p>
                )}
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { usePathname } from "next/navigation";

// Define proper type for Naruto clan
type ClanType = {
  id: number;
  name: string;
  characters: number[]; // Number of characters in the clan
};

type ClanCardsProps = {
  data?: ClanType[];
};

export default function ClanCard({ data }: ClanCardsProps) {
  const pathName = usePathname();

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No clans available</p>
      </div>
    );
  }

  // Function to generate consistent color based on clan name
  const getColorFromName = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Naruto-themed color palette
    const colors = [
      "#FF4500", // Naruto orange
      "#1E90FF", // Sasuke blue
      "#008080", // Teal for water jutsu
      "#9932CC", // Purple for genjutsu
      "#8B0000", // Dark red for Sharingan
      "#006400", // Dark green for Hidden Leaf
      "#FF8C00", // Dark orange for kyuubi
      "#483D8B", // Slate blue for Kakashi
    ];

    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {data.map((clan) => (
        <Link
          href={`/${pathName.slice(1)}/${clan.id}`}
          key={clan.id}
          className="block h-full"
        >
          <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group border border-slate-200 dark:border-slate-800">
            <div className="px-5">
              {/* Clan name with left border accent */}
              <h3
                className="text-lg font-bold pl-3 border-l-4 py-1"
                style={{ borderColor: getColorFromName(clan.name) }}
              >
                {clan.name}
              </h3>

              {/* Optional members count */}
              {clan.characters.length !== 0 && (
                <p className="text-sm text-muted-foreground mt-3 pl-3">
                  {clan.characters?.length}{" "}
                  {clan.characters?.length === 1 ? "character" : "characters"}
                </p>
              )}
            </div>

            {/* Bottom decorative element */}
            {/* <div
              className="h-1.5 w-1/3 mx-auto rounded-t-full mt-auto"
              style={{ background: getColorFromName(clan.name) }}
            /> */}
          </Card>
        </Link>
      ))}
    </div>
  );
}

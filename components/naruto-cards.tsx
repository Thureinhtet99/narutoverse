import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const categories = [
  {
    name: "Characters",
    description: "Explore all characters from the Naruto universe",
    image: "/images/characters.jpg",
    href: "/characters",
  },
  {
    name: "Clans",
    description: "Discover the powerful ninja clans",
    image: "/images/clans.jpg",
    href: "/clans",
  },
  {
    name: "Villages",
    description: "Learn about the hidden villages",
    image: "/images/villages.jpg",
    href: "/villages",
  },
  {
    name: "Teams",
    description: "Browse teams and their members",
    image: "/images/teams.jpg",
    href: "/teams",
  },
  {
    name: "Akatsuki",
    description: "Meet the rogue ninja organization",
    image: "/images/akatsuki.jpg",
    href: "/akatsuki",
  },
  {
    name: "Kara",
    description: "Learn about the mysterious organization",
    image: "/images/kara.jpg",
    href: "/kara",
  },
  {
    name: "Kekkei Genkai",
    description: "Discover bloodline abilities",
    image: "/images/kekkei-genkai.jpg",
    href: "/kekkei-genkai",
  },
  {
    name: "Tailed Beasts",
    description: "Learn about the powerful tailed beasts",
    image: "/images/tailed-beasts.jpg",
    href: "/tailed-beasts",
  },
];

export default function NarutoCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {categories.map((category) => (
        <Link href={category.href} key={category.name}>
          <Card className="hover:shadow-lg transition-shadow h-full">
            <div className="aspect-video relative overflow-hidden rounded-t-lg">
              <div className="absolute inset-0 bg-black/50 z-10" />
              <div className="relative h-48 w-full">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={false}
                />
              </div>
            </div>
            <CardHeader className="pb-2">
              <CardTitle>{category.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{category.description}</CardDescription>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

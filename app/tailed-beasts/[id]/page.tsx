"use client";

import { API_CONFIG } from "@/configs/apiConfig";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { CharacterType } from "@/types/index";

export default function TailedBeastDetail() {
  const { id } = useParams();

  const {
    isLoading,
    error,
    data: beast,
  } = useQuery<CharacterType>({
    queryKey: ["tailed-beast", id],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `${API_CONFIG.BASE_URL}${API_CONFIG.TAILED_BEASTS.GET}/${id}`
        );
        return response.data;
      } catch (error) {
        console.error("Error fetching tailed beast:", error);
        throw new Error(
          "Failed to fetch tailed beast. Please try again later."
        );
      }
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <Card className="bg-gray-900 border-orange-600 shadow-lg shadow-orange-900/30">
          <CardHeader className="pb-2">
            <div className="flex flex-col md:flex-row gap-6 items-center mb-4">
              <Skeleton className="w-70 h-48 md:w-100 md:h-64 rounded-md bg-gray-800" />
              <div className="flex-1 space-y-4 w-full">
                <Skeleton className="h-10 w-3/4 bg-gray-800" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20 bg-gray-800" />
                  <Skeleton className="h-6 w-20 bg-gray-800" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Skeleton className="h-8 bg-gray-800" />
                  <Skeleton className="h-8 bg-gray-800" />
                </div>
              </div>
            </div>
          </CardHeader>
          <Separator className="bg-orange-800/50" />
          <CardContent className="pt-6 space-y-6">
            <Skeleton className="h-40 bg-gray-800" />
            <Skeleton className="h-24 bg-gray-800" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !beast) {
    return (
      <div className="container mx-auto">
        <Alert
          variant="destructive"
          className="bg-orange-950 border-orange-600"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load Tailed Beast. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <Card className="bg-gray-900 border-orange-600 shadow-lg shadow-orange-900/30">
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row gap-6 items-center mb-4">
            {beast.images && beast.images[0] && (
              <div className="relative w-70 h-48 md:w-100 md:h-64 overflow-hidden rounded-md border-2 border-orange-500">
                <Image
                  src={beast.images[0]}
                  alt={beast.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="flex-1">
              <div className="flex items-center gap-3">
                <CardTitle className="text-3xl md:text-4xl text-orange-500 mb-2">
                  {beast.name}
                </CardTitle>
              </div>

              {beast.personal?.affiliation && (
                <div className="mt-2">
                  <span className="text-gray-400 text-sm">Affiliation</span>
                  <div className="text-white">{beast.personal.affiliation}</div>
                </div>
              )}

              {beast.personal?.status && (
                <div className="mt-2">
                  <span className="text-gray-400 text-sm">Status</span>
                  <div
                    className={`${
                      beast.personal.status.toLowerCase() === "deceased"
                        ? "text-red-400"
                        : "text-green-400"
                    }`}
                  >
                    {beast.personal.status}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <Separator className="bg-orange-800/50" />

        <CardContent className="pt-6">
          {/* {beast.description && (
            <div className="mb-10">
              <h3 className="text-lg font-semibold text-orange-400 mb-2">
                Description
              </h3>
              <p className="text-gray-300">{beast.description}</p>
            </div>
          )} */}

          {beast.personal?.jinchūriki &&
            beast.personal.jinchūriki.length > 0 && (
              <div className="mb-10">
                <h3 className="text-lg font-semibold text-orange-400 mb-2">
                  Jinchūriki
                </h3>
                <div className="flex flex-wrap gap-2">
                  {beast.personal.jinchūriki.map((jinchuriki, i) => (
                    <Badge
                      key={i}
                      className="bg-gray-800 text-gray-200 px-3 py-1"
                    >
                      {jinchuriki}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

          {beast.jutsu && beast.jutsu.length > 0 && (
            <div className="mb-10">
              <h3 className="text-lg font-semibold text-orange-400 mb-2">
                Jutsu
              </h3>
              <div className="flex flex-wrap gap-2">
                {beast.jutsu.map((jutsu, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="bg-orange-950/50 text-orange-200 border-orange-600"
                  >
                    {jutsu}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {beast.natureType && beast.natureType.length > 0 && (
            <div className="mb-10">
              <h3 className="text-lg font-semibold text-orange-400 mb-2">
                Nature Types
              </h3>
              <div className="flex flex-wrap gap-2">
                {beast.natureType.map((nature, i) => (
                  <Badge key={i} className="bg-gray-800 text-orange-300">
                    {nature}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {beast.family && (
            <div className="mb-10">
              <h3 className="text-lg font-semibold text-orange-400 mb-2">
                Family
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {beast.family.creator && (
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-sm">Creator</span>
                    <span className="text-white">{beast.family.creator}</span>
                  </div>
                )}
                {beast.family["incarnation with the god tree"] && (
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-sm">
                      Incarnation with the god tree
                    </span>
                    <span className="text-white">
                      {beast.family["incarnation with the god tree"]}
                    </span>
                  </div>
                )}
                {beast.family.sibling && (
                  <div className="flex flex-col">
                    <div className="flex flex-col">
                      <span className="text-gray-400 text-sm">Sibling</span>
                      <span className="text-white">{beast.family.sibling}</span>
                    </div>
                  </div>
                )}
                {beast.family["depowered form"] && (
                  <div className="flex flex-col">
                    <div className="flex flex-col">
                      <span className="text-gray-400 text-sm">
                        Depowered form
                      </span>
                      <span className="text-white">
                        {beast.family["depowered form"]}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Debut Information */}
          {beast.debut && Object.keys(beast.debut).length > 0 && (
            <div className="mb-10">
              <h3 className="text-lg font-semibold text-orange-400 mb-2">
                First Appearance
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {beast.debut.manga && (
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-sm">Manga</span>
                    <span className="text-white">{beast.debut.manga}</span>
                  </div>
                )}
                {beast.debut.anime && (
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-sm">Anime</span>
                    <span className="text-white">{beast.debut.anime}</span>
                  </div>
                )}
                {beast.debut.novel && (
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-sm">Novel</span>
                    <span className="text-white">{beast.debut.novel}</span>
                  </div>
                )}
                {beast.debut.movie && (
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-sm">Movie</span>
                    <span className="text-white">{beast.debut.movie}</span>
                  </div>
                )}
                {beast.debut.game && (
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-sm">Game</span>
                    <span className="text-white">{beast.debut.game}</span>
                  </div>
                )}
                {beast.debut.ova && (
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-sm">Ova</span>
                    <span className="text-white">{beast.debut.ova}</span>
                  </div>
                )}
                {beast.debut.appearsIn && (
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-sm">Appears In</span>
                    <span className="text-white">{beast.debut.appearsIn}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Voice Actors */}
          {beast.voiceActors && (
            <div className="mb-10">
              <h3 className="text-lg font-semibold text-orange-400 mb-2">
                Voice Actors
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                {beast.voiceActors.japanese && (
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-sm">Japanese</span>
                    <span className="text-white">
                      {beast.voiceActors.japanese}
                    </span>
                  </div>
                )}
                {beast.voiceActors.english && (
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-sm">English</span>
                    <span className="text-white">
                      {typeof beast.voiceActors.english === "string"
                        ? beast.voiceActors.english
                        : Array.isArray(beast.voiceActors.english)
                        ? beast.voiceActors.english.join(", ")
                        : "Unknown"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {beast.uniqueTraits && beast.uniqueTraits.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-orange-400 mb-2">
                Unique Traits
              </h3>
              <ul className="list-disc pl-4 text-gray-300 space-y-1">
                {beast.uniqueTraits.map((trait, i) => (
                  <li key={i}>{trait}</li>
                ))}
              </ul>
            </div>
          )}

          {beast.personal && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-orange-400 mb-2">
                Additional Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {beast.personal.species && (
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-sm">Species</span>
                    <span className="text-white">{beast.personal.species}</span>
                  </div>
                )}

                {beast.personal.classification && (
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-sm">
                      Classification
                    </span>
                    {Array.isArray(beast.personal.classification) ? (
                      <div className="flex flex-wrap gap-1">
                        {beast.personal.classification.map((c, i) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className="bg-gray-800 text-gray-200 border-gray-700"
                          >
                            {c}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-white">
                        {beast.personal.classification}
                      </span>
                    )}
                  </div>
                )}

                {beast.personal.kekkeiGenkai && (
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-sm">Kekkei Genkai</span>
                    <ul className="list-disc pl-4 text-gray-300 space-y-1">
                      {Array.isArray(beast.personal.kekkeiGenkai) ? (
                        beast.personal.kekkeiGenkai.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))
                      ) : (
                        <li>{beast.personal.kekkeiGenkai}</li>
                      )}
                    </ul>
                  </div>
                )}

                {beast.personal.titles && (
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-sm">Titles</span>
                    {beast.personal.titles && (
                      <ul className="list-disc pl-4 text-gray-300 space-y-1">
                        {beast.personal.titles.map((title, i) => (
                          <li key={i}>{title}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

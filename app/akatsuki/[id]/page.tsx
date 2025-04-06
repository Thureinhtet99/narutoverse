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

export default function AkatsukiDetail() {
  const { id } = useParams();

  const {
    isLoading,
    error,
    data: member,
  } = useQuery<CharacterType>({
    queryKey: ["akatsuki-detail", id],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `${API_CONFIG.BASE_URL}${API_CONFIG.AKATSUKI.GET}/${id}`
        );
        return response.data;
      } catch (error) {
        console.error("Error fetching akatsuki:", error);
        throw new Error("Failed to fetch akatsuki. Please try again later.");
      }
    },
  });

  // Helper function to safely display object or string values
  const displayValue = (
    value: string | { "Part II"?: string } | unknown
  ): string => {
    if (!value) return "";
    if (typeof value === "string") return value;
    if (typeof value === "object" && value !== null && "Part II" in value)
      return value["Part II"] as string;
    return JSON.stringify(value).replace(/[{}"]/g, "");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto">
        <Card className="bg-gray-900 border-red-600 shadow-lg shadow-red-900/30">
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
          <Separator className="bg-red-800/50" />
          <CardContent className="pt-6 space-y-6">
            <Skeleton className="h-40 bg-gray-800" />
            <Skeleton className="h-24 bg-gray-800" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="container mx-auto py-10 px-4">
        <Alert variant="destructive" className="bg-red-950 border-red-600">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load Akatsuki member. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Get nature types from either property name
  const natureTypes = member.natureType || [];
  const uniqueTraits = member.uniqueTraits || [];
  const voiceActors = member.voiceActors;

  return (
    <div className="container mx-auto">
      <Card className="bg-gray-900 border-red-600 shadow-lg shadow-red-900/30">
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row gap-6 items-center mb-4">
            {member.images && member.images[0] && (
              <div className="relative w-70 h-48 md:w-100 md:h-64 overflow-hidden rounded-md border-2 border-red-500">
                <Image
                  src={member.images[0]}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="flex-1">
              <CardTitle className="text-3xl md:text-4xl text-red-500 mb-2">
                {member.name}
              </CardTitle>

              <div className="flex flex-wrap gap-2 my-3">
                {member.jutsu && member.jutsu.length > 0 && (
                  <div className="w-full">
                    <span className="text-gray-400 text-sm">Jutsu</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {member.jutsu.slice(0, 4).map((j, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="bg-red-950/50 text-red-200 border-red-600"
                        >
                          {j}
                        </Badge>
                      ))}
                      {member.jutsu.length > 4 && (
                        <Badge
                          variant="outline"
                          className="bg-red-950/50 text-red-200 border-red-600"
                        >
                          +{member.jutsu.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {member.rank && (
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-sm">Rank</span>
                    <span className="text-white">
                      {typeof member.rank === "string"
                        ? member.rank
                        : member.rank.ninjaRegistration || "Unknown"}
                    </span>
                  </div>
                )}

                {member.village && (
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-sm">Village</span>
                    <span className="text-white">{member.village}</span>
                  </div>
                )}

                {member.personal?.status && (
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-sm">Status</span>
                    <span
                      className={`${
                        member.personal.status.toLowerCase() === "deceased"
                          ? "text-red-400"
                          : "text-green-400"
                      }`}
                    >
                      {member.personal.status}
                    </span>
                  </div>
                )}

                {member.personal?.sex && (
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-sm">Gender</span>
                    <span className="text-white">{member.personal.sex}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <Separator className="bg-red-800/50" />

        <CardContent className="pt-6">
          {(member.personal?.occupation || member.personal?.occupation) && (
            <div className="mb-10">
              <h3 className="text-lg font-semibold text-red-400 mb-2">
                Occupation
              </h3>
              <p className="text-gray-300">
                {member.personal?.occupation || member.personal?.occupation}
              </p>
            </div>
          )}

          {/* Debut Information */}
          {member.debut && Object.keys(member.debut).length > 0 && (
            <div className="mb-10">
              <h3 className="text-lg font-semibold text-red-400 mb-2">
                First Appearance
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {member.debut.manga && (
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-sm">Manga</span>
                    <span className="text-white">{member.debut.manga}</span>
                  </div>
                )}
                {member.debut.anime && (
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-sm">Anime</span>
                    <span className="text-white">{member.debut.anime}</span>
                  </div>
                )}
                {member.debut.novel && (
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-sm">Novel</span>
                    <span className="text-white">{member.debut.novel}</span>
                  </div>
                )}
                {member.debut.movie && (
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-sm">Movie</span>
                    <span className="text-white">{member.debut.movie}</span>
                  </div>
                )}
                {member.debut.game && (
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-sm">Game</span>
                    <span className="text-white">{member.debut.game}</span>
                  </div>
                )}
                {member.debut.ova && (
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-sm">Ova</span>
                    <span className="text-white">{member.debut.ova}</span>
                  </div>
                )}
                {member.debut.appearsIn && (
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-sm">Appears In</span>
                    <span className="text-white">{member.debut.appearsIn}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Voice Actors */}
          {voiceActors && (
            <div className="mb-10">
              <h3 className="text-lg font-semibold text-red-400 mb-2">
                Voice Actors
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {voiceActors.japanese && (
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-sm">Japanese</span>
                    <span className="text-white">
                      {Array.isArray(voiceActors.japanese)
                        ? voiceActors.japanese.join(", ")
                        : voiceActors.japanese}
                    </span>
                  </div>
                )}
                {voiceActors.english && (
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-sm">English</span>
                    <span className="text-white">
                      {Array.isArray(voiceActors.english)
                        ? voiceActors.english.join(", ")
                        : voiceActors.english}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {member.family && Object.keys(member.family).length > 0 && (
            <div className="mb-10">
              <h3 className="text-lg font-semibold text-red-400 mb-2">
                Family
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                {Object.entries(member.family).map(([relation, name]) => (
                  <div key={relation} className="flex flex-col">
                    <span className="text-gray-400 text-sm capitalize">
                      {relation.replace(/[_-]/g, " ")}
                    </span>
                    <span className="text-white">{name as string}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {natureTypes.length > 0 && (
            <div className="mb-10">
              <h3 className="text-lg font-semibold text-red-400 mb-2">
                Nature Types
              </h3>
              <div className="flex flex-wrap gap-2">
                {natureTypes.map((nature, i) => (
                  <Badge key={i} className="bg-gray-800 text-red-300">
                    {nature}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {member.tools && member.tools.length > 0 && (
            <div className="mb-10">
              <h3 className="text-lg font-semibold text-red-400 mb-2">Tools</h3>
              <div className="flex flex-wrap gap-2">
                {member.tools.map((tool, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="bg-gray-800 text-gray-200"
                  >
                    {tool}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {member.jutsu && member.jutsu.length > 4 && (
            <div className="mb-10">
              <h3 className="text-lg font-semibold text-red-400 mb-2">
                All Jutsu
              </h3>
              <div className="flex flex-wrap gap-2">
                {member.jutsu.map((jutsu, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="bg-red-950/50 text-red-200 border-red-600"
                  >
                    {jutsu}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {member.personal && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-red-400 mb-2">
                Personal Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {member.personal.species && (
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-sm">Species</span>
                    <span className="text-white">
                      {member.personal.species}
                    </span>
                  </div>
                )}

                {member.personal.birthdate && (
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-sm">Birthdate</span>
                    <span className="text-white">
                      {member.personal.birthdate}
                    </span>
                  </div>
                )}

                {member.personal.age && (
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-sm">Age</span>
                    <span className="text-white">
                      {displayValue(member.personal.age)}
                    </span>
                  </div>
                )}

                {member.personal.height && (
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-sm">Height</span>
                    <span className="text-white">
                      {displayValue(member.personal.height)}
                    </span>
                  </div>
                )}

                {member.personal.weight && (
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-sm">Weight</span>
                    <span className="text-white">
                      {displayValue(member.personal.weight)}
                    </span>
                  </div>
                )}

                {(member.personal.bloodType || member.personal.bloodType) && (
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-sm">Blood Type</span>
                    <span className="text-white">
                      {member.personal.bloodType || member.personal.bloodType}
                    </span>
                  </div>
                )}
                {member.personal.affiliation && (
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-sm">Affiliation</span>
                    {Array.isArray(member.personal.affiliation) ? (
                      <div className="flex flex-wrap gap-1">
                        {member.personal.affiliation.map((affiliation, i) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className="bg-gray-800 text-gray-200 border-gray-700"
                          >
                            {affiliation}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-white">
                        {member.personal.affiliation}
                      </span>
                    )}
                  </div>
                )}

                {member.personal.classification && (
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-sm">
                      Classification
                    </span>
                    {Array.isArray(member.personal.classification) ? (
                      <div className="flex flex-wrap gap-1">
                        {member.personal.classification.map((c, i) => (
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
                        {member.personal.classification}
                      </span>
                    )}
                  </div>
                )}

                {member.personal.kekkeiGenkai && (
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-sm">Kekkei Genkai</span>
                    <ul className="list-disc pl-4 text-gray-300 space-y-1">
                      {Array.isArray(member.personal.kekkeiGenkai) ? (
                        member.personal.kekkeiGenkai.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))
                      ) : (
                        <li>{member.personal.kekkeiGenkai}</li>
                      )}
                    </ul>
                  </div>
                )}

                {member.personal.team && (
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-sm">Teams</span>
                    <div className="flex flex-wrap gap-1">
                      {Array.isArray(member.personal.team) ? (
                        member.personal.team.map((team, i) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className="bg-gray-800 text-gray-200 border-gray-700"
                          >
                            {team}
                          </Badge>
                        ))
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-gray-800 text-gray-200 border-gray-700"
                        >
                          {member.personal.team}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {member.personal.partner &&
                  member.personal.partner.length > 0 && (
                    <div className="flex flex-col">
                      <span className="text-gray-400 text-sm">Partners</span>
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(member.personal.partner) ? (
                          member.personal.partner.map((partner, i) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="bg-gray-800 text-gray-200 border-gray-700"
                            >
                              {partner}
                            </Badge>
                          ))
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-gray-800 text-gray-200 border-gray-700"
                          >
                            {member.personal.partner}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                {member.personal.tailedBeast && (
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-sm">Tailed-beast</span>
                    <span className="text-white">
                      {member.personal.tailedBeast}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {uniqueTraits.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-red-400 mb-2">
                Unique Traits
              </h3>
              <ul className="list-disc pl-4 text-gray-300 space-y-1">
                {uniqueTraits.map((trait, i) => (
                  <li key={i}>{trait}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

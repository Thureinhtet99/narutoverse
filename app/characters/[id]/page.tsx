"use client";

import { useParams } from "next/navigation";
import { CharacterType } from "@/types";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { API_CONFIG } from "@/configs/apiConfig";

// Function to fetch character data
const fetchCharacter = async (id: string | number): Promise<CharacterType> => {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_CONFIG.CHARACTERS.GET}/${id}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch character");
  }
  return response.json();
};

export default function CharacterPage() {
  const { id } = useParams();
  const characterId = Array.isArray(id) ? id[0] : id;

  const {
    data: character,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["character", characterId],
    queryFn: () => {
      if (!characterId) {
        throw new Error("Character ID is missing");
      }
      return fetchCharacter(characterId);
    },
    enabled: !!characterId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <CharacterSkeleton />;
  }

  if (error || !character) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-2xl font-bold">Character not found</h1>
        {error instanceof Error && (
          <p className="text-red-500 mt-2">{error.message}</p>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Character Header */}
        <div className="md:col-span-3">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative w-70 h-48 md:w-100 md:h-64 rounded-lg overflow-hidden border">
              {character.images && character.images.length > 0 ? (
                <Image
                  src={character.images[0]}
                  alt={character.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full w-full bg-muted">
                  <p className="text-muted-foreground">No image</p>
                </div>
              )}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold">{character.name}</h1>
              <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
                {character.village && (
                  <Badge variant="outline">{character.village}</Badge>
                )}
                {character.personal?.clan && (
                  <Badge variant="outline">{character.personal.clan}</Badge>
                )}
                {character.personal?.status && (
                  <Badge
                    variant={
                      character.personal.status.toLowerCase() === "deceased"
                        ? "destructive"
                        : "default"
                    }
                  >
                    {character.personal.status}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="abilities">Abilities</TabsTrigger>
              <TabsTrigger value="family">Family</TabsTrigger>
              <TabsTrigger value="other">Other</TabsTrigger>
            </TabsList>

            {/* Personal Tab */}
            <TabsContent value="personal" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {character.personal && (
                    <div className="grid grid-cols-2 gap-y-6 gap-x-2">
                      {character.personal.birthdate && (
                        <InfoItem
                          label="Birthdate"
                          value={character.personal.birthdate}
                        />
                      )}
                      {character.personal.sex && (
                        <InfoItem label="Sex" value={character.personal.sex} />
                      )}

                      {character.personal.age && (
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Age</p>
                          {typeof character.personal.age === "string" ? (
                            <p>{character.personal.age}</p>
                          ) : (
                            <div className="grid grid-cols-1 gap-1">
                              {character.personal.age["Academy Graduate"] && (
                                <p>
                                  <span>Academy:</span>{" "}
                                  {character.personal.age["Academy Graduate"]}
                                </p>
                              )}
                              {character.personal.age["Part I"] && (
                                <p>
                                  <span>Part I:</span>{" "}
                                  {character.personal.age["Part I"]}
                                </p>
                              )}
                              {character.personal.age["Part II"] && (
                                <p>
                                  <span>Part II:</span>{" "}
                                  {character.personal.age["Part II"]}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                      {/* {character.personal.age && (
                        <>
                          <InfoItem
                            label="Age"
                            value={
                              typeof character.personal.age === "string"
                                ? character.personal.age
                                : character.personal.age["Part II"] || "Unknown"
                            }
                          />
                        </>
                      )} */}
                      {character.personal.height && (
                        <InfoItem
                          label="Height"
                          value={
                            typeof character.personal.height === "string"
                              ? character.personal.height
                              : character.personal.height["Part II"] ||
                                "Unknown"
                          }
                        />
                      )}
                      {character.personal.weight && (
                        <InfoItem
                          label="Weight"
                          value={
                            typeof character.personal.weight === "string"
                              ? character.personal.weight
                              : character.personal.weight["Part II"] ||
                                "Unknown"
                          }
                        />
                      )}
                      {character.personal.bloodType && (
                        <InfoItem
                          label="Blood Type"
                          value={character.personal.bloodType}
                        />
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Classification & Occupation */}
              <Card>
                <CardHeader>
                  <CardTitle>Classification & Occupation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {character.personal?.classification && (
                    <InfoItem
                      label="Classification"
                      value={
                        Array.isArray(character.personal.classification)
                          ? character.personal.classification.join(", ")
                          : character.personal.classification
                      }
                    />
                  )}
                  {character.personal?.occupation && (
                    <InfoItem
                      label="Occupation"
                      value={
                        Array.isArray(character.personal.occupation)
                          ? character.personal.occupation.join(", ")
                          : character.personal.occupation
                      }
                    />
                  )}
                  {character.personal?.affiliation && (
                    <InfoItem
                      label="Affiliation"
                      value={
                        Array.isArray(character.personal.affiliation)
                          ? character.personal.affiliation.join(", ")
                          : character.personal.affiliation
                      }
                    />
                  )}
                  {character.personal?.team && (
                    <InfoItem
                      label="Team"
                      value={
                        Array.isArray(character.personal.team)
                          ? character.personal.team.join(", ")
                          : character.personal.team
                      }
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Abilities Tab */}
            <TabsContent value="abilities" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Jutsu & Abilities</CardTitle>
                </CardHeader>
                <CardContent>
                  {character.jutsu && character.jutsu.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="jutsu">
                        <AccordionTrigger>
                          Jutsu ({character.jutsu.length})
                        </AccordionTrigger>
                        <AccordionContent>
                          <ul className="list-disc pl-6 space-y-2">
                            {character.jutsu.map((jutsu, index) => (
                              <li key={index}>{jutsu}</li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  ) : (
                    <p className="text-muted-foreground">
                      No jutsu information available
                    </p>
                  )}

                  {character.personal?.kekkeiGenkai && (
                    <div className="mt-4">
                      <h3 className="font-medium mb-2">Kekkei Genkai</h3>
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(character.personal.kekkeiGenkai) ? (
                          character.personal.kekkeiGenkai.map((kg, index) => (
                            <Badge key={index} variant="secondary">
                              {kg}
                            </Badge>
                          ))
                        ) : (
                          <Badge variant="secondary">
                            {character.personal.kekkeiGenkai}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {character.natureType && character.natureType.length > 0 && (
                    <div className="mt-4">
                      <h3 className="font-medium mb-2">Nature Types</h3>
                      <div className="flex flex-wrap gap-2">
                        {character.natureType.map((nature, index) => (
                          <Badge key={index} variant="outline">
                            {nature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {character.tools && character.tools.length > 0 && (
                    <div className="mt-4">
                      <h3 className="font-medium mb-2">Tools</h3>
                      <ul className="list-disc pl-6 space-y-2">
                        {character.tools.map((tool, index) => (
                          <li key={index}>{tool}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Family Tab */}
            <TabsContent value="family" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Family</CardTitle>
                </CardHeader>
                <CardContent>
                  {character.family &&
                  Object.keys(character.family).length > 0 ? (
                    <div className="space-y-2">
                      {Object.entries(character.family).map(
                        ([relation, name]) => (
                          <div key={relation} className="flex justify-between">
                            <span className="font-medium capitalize">
                              {relation}
                            </span>
                            <span>{name}</span>
                            {/* <Link href="">{name}</Link> */}
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      No family information available
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Other Tab */}
            <TabsContent value="other" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Debut</CardTitle>
                </CardHeader>
                <CardContent>
                  {character.debut &&
                  Object.keys(character.debut).length > 0 ? (
                    <div className="space-y-2">
                      {Object.entries(character.debut).map(([medium, info]) => (
                        <div
                          key={medium}
                          className="flex flex-col sm:flex-row sm:justify-between gap-1"
                        >
                          <span className="font-medium capitalize">
                            {medium}
                          </span>
                          <span className="text-sm sm:text-base">{info}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      No debut information available
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Voice Actors</CardTitle>
                </CardHeader>
                <CardContent>
                  {character.voiceActors ? (
                    <div className="space-y-4">
                      {character.voiceActors.japanese && (
                        <div>
                          <h3 className="text-sm text-gray-600 mb-1">
                            Japanese
                          </h3>
                          <p>
                            {Array.isArray(character.voiceActors.japanese)
                              ? character.voiceActors.japanese.join(", ")
                              : character.voiceActors.japanese}
                          </p>
                        </div>
                      )}
                      {character.voiceActors.english && (
                        <div>
                          <h3 className="text-sm text-gray-600 mb-1">
                            English
                          </h3>
                          <p>
                            {Array.isArray(character.voiceActors.english)
                              ? character.voiceActors.english.join(", ")
                              : character.voiceActors.english}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      No voice actor information available
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {character.images && character.images.length > 1 && (
                <div className="grid grid-cols-2 gap-2">
                  {character.images.slice(0, 4).map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded overflow-hidden"
                    >
                      <Image
                        src={image}
                        alt={`${character.name} - image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {character.rank && (
                <div>
                  <h3 className="font-medium mb-2">Rank</h3>
                  {typeof character.rank === "string" ? (
                    <p>{character.rank}</p>
                  ) : (
                    <div className="space-y-1">
                      {character.rank.ninjaRank && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Ninja Rank
                          </span>
                          <div>
                            <span>
                              <span className="text-gray-600 text-sm">
                                Part I:{" "}
                              </span>
                              {typeof character.rank.ninjaRank === "object" &&
                              character.rank.ninjaRank["Part I"]
                                ? character.rank.ninjaRank["Part I"]
                                : ""}
                            </span>
                            ,{" "}
                            <span>
                              <span className="text-gray-600 text-sm">
                                Gaiden:{" "}
                              </span>
                              {typeof character.rank.ninjaRank === "object" &&
                              character.rank.ninjaRank["Gaiden"]
                                ? character.rank.ninjaRank["Gaiden"]
                                : ""}
                            </span>
                          </div>
                        </div>
                      )}
                      {character.rank.ninjaRegistration && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Registration
                          </span>
                          <span>{character.rank.ninjaRegistration}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {character.personal?.titles &&
                character.personal.titles.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2">Titles</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      {character.personal.titles.map((title, index) => (
                        <li key={index} className="break-words">
                          {title}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {character.uniqueTraits && character.uniqueTraits.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Unique Traits</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    {character.uniqueTraits.map((trait, index) => (
                      <li key={index}>{trait}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Helper component for displaying info items
function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p>{value}</p>
    </div>
  );
}

// Skeleton loading state
function CharacterSkeleton() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-3">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Skeleton className="h-48 w-48 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
          </div>
        </div>
        <div className="md:col-span-2">
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-[400px] w-full" />
        </div>
        <div>
          <Skeleton className="h-[500px] w-full" />
        </div>
      </div>
    </div>
  );
}

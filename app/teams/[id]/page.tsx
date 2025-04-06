"use client";

import { API_CONFIG } from "@/configs/apiConfig";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CharacterType, ClanType } from "@/types/index";

export default function TeamDetail() {
  const { id } = useParams();

  const {
    isLoading,
    error,
    data: team,
  } = useQuery<ClanType>({
    queryKey: ["team-detail", id],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `${API_CONFIG.BASE_URL}${API_CONFIG.TEAMS.GET}/${id}`
        );
        return response.data;
      } catch (error) {
        console.error("Error fetching team:", error);
        throw new Error("Failed to fetch team. Please try again later.");
      }
    },
  });

  const { data: teamCharacters } = useQuery<CharacterType[]>({
    queryKey: ["team-characters", team?.characters],
    queryFn: async () => {
      try {
        // Early return if no team data or characters
        if (!team || !team.characters || team.characters.length === 0) {
          return [];
        }

        // Create promises for each character fetch
        const promises = team.characters.map((charId) =>
          axios.get<CharacterType>(
            `${API_CONFIG.BASE_URL}${API_CONFIG.CHARACTERS.GET}/${charId}`
          )
        );

        // Wait for all promises to resolve
        const responses = await Promise.all(promises);

        // Extract the data from each response
        return responses.map((response) => response.data);
      } catch (error) {
        console.error("Error fetching characters:", error);
        throw new Error(
          "Failed to fetch character details. Please try again later."
        );
      }
    },
    // Only enable this query when team and team.characters exist
    enabled: !!team?.characters && team.characters.length > 0,
  });

  return (
    <div className="container mx-auto py-6">
      {isLoading ? (
        <Card className="bg-gray-900 border-indigo-600 shadow-lg shadow-indigo-900/30">
          <CardHeader className="pb-2">
            <Skeleton className="h-10 bg-gray-800" />
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-20 bg-gray-800" />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : error || !team ? (
        <Alert
          variant="destructive"
          className="bg-indigo-950 border-indigo-600"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load team information. Please try again later.
          </AlertDescription>
        </Alert>
      ) : (
        <Card className="bg-gray-900 border-indigo-600 shadow-lg shadow-indigo-900/30">
          <CardHeader>
            <CardTitle className="text-3xl md:text-4xl text-indigo-400 text-center">
              {team.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {
              <div>
                <h3 className="text-lg font-semibold text-indigo-400 mb-4">
                  Team Members ({teamCharacters?.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {teamCharacters?.map((character) => (
                    <Link
                      href={`/characters/${character.id}`}
                      key={character.id}
                      className="block object-cover"
                    >
                      <Card className="bg-gray-800 hover:bg-gray-700 transition duration-200 cursor-pointer h-full">
                        <CardContent className="flex items-center gap-3">
                          <Avatar className="h-20 w-20 border border-indigo-500">
                            <AvatarImage
                              src={character.images?.[0]}
                              alt={character.name}
                              className="object-cover"
                            />
                            <AvatarFallback className="bg-indigo-900 text-indigo-200">
                              {character.name
                                ? character.name.slice(0, 2).toUpperCase()
                                : "-"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium text-white">
                              {character.name}
                            </h4>
                            {character.personal?.status && (
                              <p
                                className={`text-xs ${
                                  character.personal.status.toLowerCase() ===
                                  "deceased"
                                    ? "text-red-400"
                                    : "text-green-400"
                                }`}
                              >
                                {character.personal.status || "-"}
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            }
          </CardContent>
        </Card>
      )}
    </div>
  );
}

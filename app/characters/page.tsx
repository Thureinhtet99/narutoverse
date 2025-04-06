"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import CharacterCard from "@/components/layout/CharacterCard";
import { useInfiniteQuery } from "@tanstack/react-query";
import { API_CONFIG } from "@/configs/apiConfig";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import HeroSection from "@/components/layout/HeroSection";
import { useDebounce } from "@/hooks/useDebounce";

const ITEMS_PER_PAGE = 20;

export default function Character() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500); // Debounce search to avoid excessive API calls

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    isLoading,
    isError,
    error,
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["characters", debouncedSearchQuery],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const response = await axios.get(
          `${API_CONFIG.BASE_URL}${API_CONFIG.CHARACTERS.GET}`,
          {
            params: {
              page: pageParam,
              limit: ITEMS_PER_PAGE,
              ...(debouncedSearchQuery && { name: debouncedSearchQuery }), // Only add name param if search query exists
            },
          }
        );
        return response.data;
      } catch (error) {
        console.error("Error fetching characters:", error);
        throw new Error("Failed to fetch characters. Please try again later.");
      }
    },
    enabled: true, // Always enabled - show all characters initially
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const totalPages = Math.ceil(lastPage.total / lastPage.pageSize);
      const nextPage = lastPage.currentPage + 1;

      return nextPage <= totalPages ? nextPage : undefined;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // When search query changes, reset to page 1
  useEffect(() => {
    refetch();
  }, [debouncedSearchQuery, refetch]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Setup intersection observer for infinite scrolling
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const element = loadMoreRef.current;
    if (element) {
      observerRef.current = new IntersectionObserver(handleObserver, {
        threshold: 0.1, // Lower threshold to trigger loading earlier
      });
      observerRef.current.observe(element);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver]);

  // Combine all characters from all pages
  const allCharacters = data?.pages.flatMap((page) => page.characters) || [];

  return (
    <>
      <div className="space-y-10">
        <HeroSection query={searchQuery} handleSearch={handleSearch} />

        {/* No results state */}
        {!isLoading && !isError && allCharacters.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No characters found</p>
          </div>
        )}

        {/* Initial loading state */}
        {isLoading && (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            <span className="ml-2 text-muted-foreground">
              Loading characters...
            </span>
          </div>
        )}

        {/* Error state */}
        {isError && (
          <Alert variant="destructive" className="mx-auto max-w-2xl">
            <AlertTitle className="font-semibold">Error</AlertTitle>
            <AlertDescription>
              {error instanceof Error
                ? error.message
                : "Something went wrong. Please try again."}
            </AlertDescription>
          </Alert>
        )}

        {/* Cards section */}
        {!isLoading && !isError && allCharacters.length > 0 && (
          <>
            <CharacterCard loading={isLoading} data={allCharacters} />

            {/* Load more trigger element */}
            <div ref={loadMoreRef} className="py-4 text-center">
              {isFetchingNextPage ? (
                <div className="flex justify-center items-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
                  <span className="ml-2 text-muted-foreground">
                    Loading more characters...
                  </span>
                </div>
              ) : hasNextPage ? (
                <span className="text-sm text-muted-foreground">
                  Scroll for more
                </span>
              ) : (
                <span className="text-sm text-muted-foreground">
                  {allCharacters.length}{" "}
                  {`${
                    allCharacters.length === 1 ? "character" : "characters"
                  } found`}
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { API_CONFIG } from "@/configs/apiConfig";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import HeroSection from "@/components/layout/HeroSection";
import { useDebounce } from "@/hooks/useDebounce";
import CharacterCard from "@/components/layout/CharacterCard";

const ITEMS_PER_PAGE = 20; // Adjust based on your API's pagination

export default function TailedBeast() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500); // Debounce search to avoid excessive API calls

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["tailed-beasts"],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const response = await axios.get(
          `${API_CONFIG.BASE_URL}${API_CONFIG.TAILED_BEASTS.GET}`,
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
        console.error("Error fetching tailed-beasts:", error);
        throw new Error(
          "Failed to fetch tailed-beasts. Please try again later."
        );
      }
    },
    enabled: true, // Always enabled - show all characters initially

    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      // Calculate if we have more pages based on total count
      const totalPages = Math.ceil(lastPage.total / lastPage.pageSize);
      const nextPage = lastPage.currentPage + 1;

      // Return undefined when there are no more pages
      return nextPage <= totalPages ? nextPage : undefined;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    refetch();
  }, [debouncedSearchQuery, refetch]);

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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Combine all tailed-beasts from all pages
  const allTailed_beasts =
    data?.pages.flatMap((page) => page["tailed-beasts"]) || [];

  return (
    <>
      <div className="space-y-10">
        <HeroSection query={searchQuery} handleSearch={handleSearch} />

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

        {/* Initial loading state */}
        {isLoading && (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            <span className="ml-2 text-muted-foreground">
              Loading tailed-beasts...
            </span>
          </div>
        )}

        {/* Cards section */}
        {!isLoading && !isError && (
          <>
            <CharacterCard loading={isLoading} data={allTailed_beasts} />

            {/* Load more trigger element */}
            <div ref={loadMoreRef} className="py-4 text-center">
              {isFetchingNextPage ? (
                <div className="flex justify-center items-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
                  <span className="ml-2 text-muted-foreground">
                    Loading more tailed-beasts...
                  </span>
                </div>
              ) : hasNextPage ? (
                <span className="text-sm text-muted-foreground">
                  Scroll for more
                </span>
              ) : (
                <span className="text-sm text-muted-foreground">
                  {allTailed_beasts.length}{" "}
                  {`${
                    allTailed_beasts.length === 1
                      ? "tailed-beast"
                      : "tailed-beasts"
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

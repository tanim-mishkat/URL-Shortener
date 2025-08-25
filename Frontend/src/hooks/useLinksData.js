import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { listLinks } from "../api/shortUrl.api";

/**
 * Safe getter for possibly-nested/optional fields.
 */
function toStr(v) {
    if (v == null) return "";
    if (Array.isArray(v)) return v.join(" ");
    return String(v);
}

export default function useLinksData({ folderId, search, tag }) {
    // Normalize inputs
    const normSearch = useMemo(() => {
        const v = (search ?? "").trim().toLowerCase();
        return v.length ? v : undefined;
    }, [search]);

    const normTag = useMemo(() => {
        const v = (tag ?? "").trim().toLowerCase();
        return v.length ? v : undefined;
    }, [tag]);

    const {
        data,
        isLoading,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: [
            "userUrls",
            {
                folderId: folderId ?? null,
                // Don't send search/tag to server - we'll filter client-side for better UX
                q: null,
                tag: null,
            },
        ],
        queryFn: ({ pageParam }) =>
            listLinks({
                limit: 50,
                cursor: pageParam,
                folderId,
                // Only send folder filter to server for efficiency
                // Client-side filtering gives better real-time experience
            }),
        getNextPageParam: (last) => last?.nextCursor ?? undefined,
        refetchOnWindowFocus: false,
        retry: 1,
    });

    // FIX: memoize pages so the dependency of the next useMemo is stable
    const pages = useMemo(() => data?.pages ?? [], [data]);

    const allUrls = useMemo(
        () => pages.flatMap((p) => p?.items ?? []),
        [pages]
    );

    // Enhanced client-side filter that is robust to missing fields
    const filteredUrls = useMemo(() => {
        let out = allUrls;

        // Apply search filter
        if (normSearch) {
            out = out.filter((u) => {
                // Get folder name safely
                const folderName =
                    u.folderId && typeof u.folderId === "object"
                        ? toStr(u.folderId.name)
                        : toStr(u.folderName) || "";

                // Create comprehensive searchable text
                const searchableFields = [
                    toStr(u.fullUrl),
                    toStr(u.shortUrl),
                    folderName,
                    toStr(u.title || ""),
                    toStr(u.description || ""),
                    // Include tags in search
                    ...(Array.isArray(u.tags) ? u.tags.map((t) => toStr(t)) : []),
                ].filter(Boolean); // Remove empty strings

                const haystack = searchableFields.join(" ").toLowerCase();

                // Support multi-word search (all words must match)
                const searchWords = normSearch.split(/\s+/).filter(Boolean);
                return searchWords.every((word) => haystack.includes(word));
            });
        }

        // Apply tag filter
        if (normTag) {
            out = out.filter((u) => {
                if (!Array.isArray(u.tags)) return false;
                return u.tags.some((t) => {
                    const tagStr = toStr(t).toLowerCase();
                    // Support partial tag matching
                    return tagStr.includes(normTag) || normTag.includes(tagStr);
                });
            });
        }

        return out;
    }, [allUrls, normSearch, normTag]);

    return {
        allUrls,
        filteredUrls,
        isLoading,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    };
}

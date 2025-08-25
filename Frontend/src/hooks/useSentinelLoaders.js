import { useEffect, useRef } from "react";

export default function useSentinelLoaders({ hasNextPage, isFetchingNextPage, fetchNextPage }) {
    const tableSentinelRef = useRef(null);
    const mobileSentinelRef = useRef(null);

    useEffect(() => {
        const el = tableSentinelRef.current;
        if (!el) return;
        const io = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage();
        });
        io.observe(el);
        return () => io.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    useEffect(() => {
        const el = mobileSentinelRef.current;
        if (!el) return;
        const io = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage();
        });
        io.observe(el);
        return () => io.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    return { tableSentinelRef, mobileSentinelRef };
}

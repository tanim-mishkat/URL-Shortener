import { useEffect } from "react";

export default function useDragEdgeScroll() {
    useEffect(() => {
        const EDGE = 80;
        const SPEED = 24;
        const onDragOver = (e) => {
            const y = e.clientY;
            const h = window.innerHeight;
            if (y < EDGE) {
                const d = Math.ceil(((EDGE - y) / EDGE) * SPEED);
                window.scrollBy(0, -d);
            } else if (y > h - EDGE) {
                const d = Math.ceil(((y - (h - EDGE)) / EDGE) * SPEED);
                window.scrollBy(0, d);
            }
        };
        window.addEventListener("dragover", onDragOver, { passive: true });
        return () => window.removeEventListener("dragover", onDragOver);
    }, []);
}

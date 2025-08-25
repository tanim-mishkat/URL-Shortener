import { useCallback, useMemo, useState } from "react";

export default function useSelection(items) {
    const [selected, setSelected] = useState(() => new Set());

    const allSelectedOnPage = useMemo(
        () => items.length > 0 && items.every((u) => selected.has(u._id)),
        [items, selected]
    );
    const hasSelection = selected.size > 0;

    const toggle = useCallback((id) => {
        setSelected((s) => {
            const n = new Set(s);
            n.has(id) ? n.delete(id) : n.add(id);
            return n;
        });
    }, []);

    const clearSel = useCallback(() => setSelected(new Set()), []);

    const toggleAllOnPage = useCallback(() => {
        setSelected((s) => {
            const n = new Set(s);
            if (allSelectedOnPage) items.forEach((u) => n.delete(u._id));
            else items.forEach((u) => n.add(u._id));
            return n;
        });
    }, [allSelectedOnPage, items]);

    return { selected, toggle, clearSel, toggleAllOnPage, allSelectedOnPage, hasSelection };
}

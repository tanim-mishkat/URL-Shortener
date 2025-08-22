export const fuzzySearch = (items, query, keys) => {
    if (!query || query.trim() === "") return items;
    const searchTerms = query.toLowerCase().trim().split(/\s+/);
    return items.filter((item) =>
        searchTerms.every((term) =>
            keys.some((key) => {
                const value = key.split(".").reduce((obj, prop) => obj?.[prop], item);
                return value && value.toString().toLowerCase().includes(term);
            })
        )
    );
};

export const tagSearch = (items, tagQuery) => {
    if (!tagQuery || tagQuery.trim() === "") return items;
    const q = tagQuery.toLowerCase().trim();
    return items.filter((item) => {
        const tags = Array.isArray(item.tags) ? item.tags : [];
        return tags.some((t) => t.toLowerCase().includes(q));
    });
};

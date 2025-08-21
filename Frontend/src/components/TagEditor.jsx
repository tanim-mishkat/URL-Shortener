import React, { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { updateLinkTags } from "../api/shortUrl.api";
import { queryClient } from "../main.jsx";

export default function TagEditor({ link }) {
  const initial = Array.isArray(link.tags) ? link.tags : [];
  const [tags, setTags] = useState(initial);
  const [input, setInput] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    const tagsChanged =
      JSON.stringify(tags.sort()) !== JSON.stringify(initial.sort());
    setHasUnsavedChanges(tagsChanged);
  }, [tags, initial]);

  const { mutate: save, isLoading } = useMutation({
    mutationFn: (t) => updateLinkTags(link._id, t),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userUrls"] });
      setHasUnsavedChanges(false);
    },
    onError: (error) => {
      console.error("Failed to save tags:", error);
      alert(error?.friendlyMessage || "Failed to update tags");
    },
  });

  const validateTag = (tagValue) => {
    const v = tagValue.trim().toLowerCase();
    if (!v) return { valid: false, message: "Tag cannot be empty" };
    if (v.length > 30)
      return { valid: false, message: "Tag must be 30 characters or less" };
    if (tags.includes(v))
      return { valid: false, message: "Tag already exists" };
    if (tags.length >= 20)
      return { valid: false, message: "Maximum 20 tags allowed" };
    return { valid: true, value: v };
  };

  const addTag = () => {
    const validation = validateTag(input);
    if (!validation.valid) return;

    const next = [...tags, validation.value];
    setTags(next);
    setInput("");
  };

  const remove = (t) => {
    const next = tags.filter((x) => x !== t);
    setTags(next);
  };

  const saveTags = () => {
    if (hasUnsavedChanges) {
      save(tags);
    }
  };

  const resetTags = () => {
    setTags(initial);
    setInput("");
    setHasUnsavedChanges(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Escape") {
      setInput("");
    }
  };

  const canAddTag = input.trim() && validateTag(input).valid;

  return (
    <div className="space-y-4">
      {/* Tags Display */}
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wide">
          Tags
        </label>
        <div className="flex flex-wrap gap-2 min-h-[2rem] p-3 bg-slate-50 rounded-lg border border-slate-200">
          {tags.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm bg-blue-100 text-blue-800 border border-blue-200 font-medium"
            >
              <span className="text-blue-600">#</span>
              {t}
              <button
                onClick={() => remove(t)}
                disabled={isLoading}
                className="ml-1 text-blue-500 hover:text-red-600 hover:bg-red-50 rounded-full p-0.5 transition-colors disabled:opacity-50 disabled:hover:text-blue-500 disabled:hover:bg-transparent"
                title="Remove tag"
              >
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </span>
          ))}
          {!tags.length && (
            <span className="text-sm text-slate-500 italic py-1">
              No tags assigned
            </span>
          )}
        </div>
      </div>

      {/* Add Tag Input */}
      <div>
        <div className="flex gap-2">
          <div className="flex-1">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a tag..."
              maxLength={30}
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm bg-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-colors disabled:bg-slate-50 disabled:text-slate-500"
            />
            {input && !validateTag(input).valid && (
              <p className="mt-1 text-xs text-red-600">
                {validateTag(input).message}
              </p>
            )}
          </div>
          <button
            onClick={addTag}
            disabled={!canAddTag || isLoading}
            className="px-4 py-3 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            title="Add tag"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Adding...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Add
              </>
            )}
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Press Enter to add • {tags.length}/20 tags • Max 30 characters per tag
        </p>
      </div>

      {/* Save/Reset Actions */}
      {hasUnsavedChanges && (
        <div className="flex items-center gap-3 pt-3 border-t border-slate-200">
          <div className="flex items-center gap-2 text-xs text-amber-600">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            Unsaved changes
          </div>
          <div className="flex gap-2 ml-auto">
            <button
              onClick={resetTags}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Reset
            </button>
            <button
              onClick={saveTags}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              {isLoading ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

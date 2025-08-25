import React, { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Plus,
  X,
  Hash,
  AlertTriangle,
  Save,
  RotateCcw,
  Tag,
} from "lucide-react";
import { updateLinkTags } from "../api/shortUrl.api";
import { queryClient } from "../main.jsx";

export default function TagEditor({ link }) {
  const initial = Array.isArray(link.tags) ? [...link.tags] : [];
  const [tags, setTags] = useState(initial);
  const [input, setInput] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [validationError, setValidationError] = useState("");

  // Check for unsaved changes whenever tags change
  useEffect(() => {
    const currentSorted = [...tags].sort();
    const initialSorted = [...initial].sort();
    const tagsChanged =
      JSON.stringify(currentSorted) !== JSON.stringify(initialSorted);
    setHasUnsavedChanges(tagsChanged);
  }, [tags, initial]);

  // Update local state when link prop changes
  useEffect(() => {
    const newInitial = Array.isArray(link.tags) ? [...link.tags] : [];
    setTags(newInitial);
    setHasUnsavedChanges(false);
    setValidationError("");
  }, [link._id, link.tags]);

  const { mutate: save, isLoading } = useMutation({
    mutationFn: (newTags) => updateLinkTags(link._id, newTags),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userUrls"] });
      // Update initial state to match saved state
      const updatedInitial = [...tags];
      setHasUnsavedChanges(false);
      setValidationError("");
    },
    onError: (error) => {
      console.error("Failed to save tags:", error);
      setValidationError(
        error?.message || error?.friendlyMessage || "Failed to update tags"
      );
    },
  });

  const validateTag = (tagValue) => {
    const v = tagValue.trim().toLowerCase();
    if (!v) return { valid: false, message: "Tag cannot be empty" };
    if (v.length > 30)
      return { valid: false, message: "Tag must be 30 characters or less" };
    if (!/^[a-z0-9\-_]+$/i.test(v))
      return {
        valid: false,
        message:
          "Tags can only contain letters, numbers, hyphens, and underscores",
      };
    if (tags.some((tag) => tag.toLowerCase() === v))
      return { valid: false, message: "Tag already exists" };
    if (tags.length >= 20)
      return { valid: false, message: "Maximum 20 tags allowed" };
    return { valid: true, value: v };
  };

  const addTag = () => {
    const validation = validateTag(input);
    if (!validation.valid) {
      setValidationError(validation.message);
      return;
    }

    setTags((prev) => [...prev, validation.value]);
    setInput("");
    setValidationError("");
  };

  const removeTag = (tagToRemove) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
    setValidationError("");
  };

  const saveTags = () => {
    if (hasUnsavedChanges && !isLoading) {
      save(tags);
    }
  };

  const resetTags = () => {
    setTags([...initial]);
    setInput("");
    setHasUnsavedChanges(false);
    setValidationError("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Escape") {
      setInput("");
      setValidationError("");
    } else if (e.key === "," || e.key === " ") {
      e.preventDefault();
      if (input.trim()) {
        addTag();
      }
    }
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value.replace(/[,\s]+/g, ""); // Remove commas and spaces
    setInput(newValue);
    if (validationError) {
      setValidationError("");
    }
  };

  const canAddTag = input.trim() && validateTag(input).valid;

  return (
    <div className="space-y-4 bg-white rounded-xl border border-slate-200/70 p-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Tag className="w-4 h-4 text-indigo-500" />
        <label className="text-sm font-semibold text-slate-800">Tags</label>
        <span className="text-xs text-slate-500">({tags.length}/20)</span>
      </div>

      {/* Tags Display */}
      <div className="min-h-[3rem]">
        {tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 border border-indigo-200/60 font-medium hover:from-indigo-100 hover:to-blue-100 transition-colors"
              >
                <Hash className="w-3 h-3 text-indigo-500" />
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  disabled={isLoading}
                  className="ml-1 text-indigo-400 hover:text-red-500 hover:bg-red-50 rounded-full p-0.5 transition-colors disabled:opacity-50 disabled:hover:text-indigo-400 disabled:hover:bg-transparent group-hover:text-indigo-600"
                  title="Remove tag"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-12 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50/50">
            <span className="text-sm text-slate-500 italic flex items-center gap-2">
              <Hash className="w-4 h-4" />
              No tags assigned
            </span>
          </div>
        )}
      </div>

      {/* Add Tag Input */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Enter tag name..."
              maxLength={30}
              disabled={isLoading || tags.length >= 20}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm bg-white focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-colors disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
            />
          </div>
          <button
            onClick={addTag}
            disabled={!canAddTag || isLoading || tags.length >= 20}
            className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-blue-500 text-white text-sm font-medium hover:from-indigo-600 hover:to-blue-600 focus:from-indigo-600 focus:to-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-sm hover:shadow-md"
            title={tags.length >= 20 ? "Maximum tags reached" : "Add tag"}
          >
            {isLoading ? (
              <>
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="hidden sm:inline">Adding...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add</span>
              </>
            )}
          </button>
        </div>

        {/* Validation Error */}
        {validationError && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-red-50 border border-red-200">
            <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-600">{validationError}</p>
          </div>
        )}

        {/* Help Text */}
        <p className="text-xs text-slate-500 flex items-center gap-4">
          <span>Press Enter, Space, or Comma to add</span>
          <span>•</span>
          <span>Max 30 characters per tag</span>
          <span>•</span>
          <span>Letters, numbers, hyphens, underscores only</span>
        </p>
      </div>

      {/* Save/Reset Actions */}
      {hasUnsavedChanges && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-medium">Unsaved changes</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={resetTags}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
            <button
              onClick={saveTags}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 text-white text-sm font-medium hover:from-emerald-600 hover:to-green-600 transition-all disabled:opacity-50 flex items-center gap-2 shadow-sm hover:shadow-md"
            >
              {isLoading ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-3 h-3" />
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

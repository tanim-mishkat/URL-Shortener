import React, { useCallback, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { getPublicBase } from "../utils/publicBase";
import {
  updateLinkStatus,
  softDeleteLink,
  hardDeleteLink,
  moveLinkToFolder,
  batchLinks,
  restoreLink,
} from "../api/shortUrl.api";

export default function useLinkActions({ qc, show, selected, clearSel }) {
  const [copiedId, setCopiedId] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [confirmDel, setConfirmDel] = useState({
    open: false,
    id: null,
    busy: false,
  });

  const handleCopy = useCallback((id, shortUrl) => {
    const url = `${getPublicBase().replace(/\/$/, "")}/${shortUrl}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const doAction = useCallback(
    async (fn, id) => {
      try {
        setActionLoading(id);
        await fn(id);
        // Invalidate both queries to refresh data
        await Promise.all([
          qc.invalidateQueries({ queryKey: ["userUrls"] }),
          qc.invalidateQueries({ queryKey: ["folders"] }),
        ]);
      } catch (e) {
        console.error("Action failed:", e);
        show(e?.friendlyMessage || "Action failed", { type: "error" });
      } finally {
        setActionLoading(null);
      }
    },
    [qc, show]
  );

  const pause = useCallback(
    (id) => doAction((x) => updateLinkStatus(x, "paused"), id),
    [doAction]
  );

  const resume = useCallback(
    (id) => doAction((x) => updateLinkStatus(x, "active"), id),
    [doAction]
  );

  const disable = useCallback((id) => doAction(softDeleteLink, id), [doAction]);

  const hardDelete = useCallback(
    (id) => setConfirmDel({ open: true, id, busy: false }),
    []
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!confirmDel.id) {
      console.error("No ID set for deletion");
      return;
    }

    setConfirmDel((s) => ({ ...s, busy: true }));

    try {
      await hardDeleteLink(confirmDel.id);
      // Invalidate queries to refresh the data
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["userUrls"] }),
        qc.invalidateQueries({ queryKey: ["folders"] }),
      ]);
      show("Link permanently deleted", { type: "success" });
    } catch (e) {
      console.error("Hard delete failed:", e);
      show(e?.friendlyMessage || "Delete failed", { type: "error" });
    } finally {
      setConfirmDel({ open: false, id: null, busy: false });
    }
  }, [confirmDel.id, qc, show]);

  const mutateBatch = useCallback(
    async (op, payload = {}, idsOverride = null) => {
      const ids = idsOverride ?? Array.from(selected);
      if (!ids.length) {
        console.warn("No IDs provided for batch operation");
        return;
      }

      try {
        await batchLinks(op, ids, payload);
        // Force refresh of queries
        await Promise.all([
          qc.invalidateQueries({ queryKey: ["userUrls"] }),
          qc.invalidateQueries({ queryKey: ["folders"] }),
        ]);

        if (op === "disable" && ids.length === 1) {
          const id = ids[0];
          show(
            ({ dismiss }) => (
              <div className="flex items-center gap-3">
                <span>Link disabled.</span>
                <button
                  onClick={async () => {
                    try {
                      await restoreLink(id);
                      await Promise.all([
                        qc.invalidateQueries({ queryKey: ["userUrls"] }),
                        qc.invalidateQueries({ queryKey: ["folders"] }),
                      ]);
                      dismiss();
                      show("Link restored", { type: "success" });
                    } catch (e) {
                      console.error("Restore failed:", e);
                      show(e?.friendlyMessage || "Restore failed", {
                        type: "error",
                      });
                    }
                  }}
                  className="underline hover:no-underline"
                >
                  Undo
                </button>
              </div>
            ),
            { duration: 5000, type: "info" }
          );
        } else if (op === "hardDelete") {
          show(
            `${ids.length} link${
              ids.length > 1 ? "s" : ""
            } permanently deleted`,
            { type: "success" }
          );
        } else if (op === "moveToFolder") {
          show("Links moved to folder successfully", { type: "success" });
        } else {
          show("Batch action completed", { type: "success" });
        }

        clearSel();
      } catch (e) {
        console.error("Batch operation failed:", e);
        show(e?.friendlyMessage || "Batch operation failed", { type: "error" });
      }
    },
    [selected, qc, show, clearSel]
  );

  const { mutate: moveFolder } = useMutation({
    mutationFn: ({ id, folderId }) => moveLinkToFolder(id, folderId),
    onSuccess: async () => {
      // Force refresh both queries
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["userUrls"] }),
        qc.invalidateQueries({ queryKey: ["folders"] }),
      ]);
      show("Link moved to folder", { type: "success" });
    },
    onError: (e) => {
      console.error("Move to folder failed:", e);
      show(e?.friendlyMessage || "Move failed", { type: "error" });
    },
  });

  const onMoveFolder = useCallback(
    (id, folderId) => moveFolder({ id, folderId }),
    [moveFolder]
  );

  const handleDropMove = useCallback(
    (ids, folderId) => mutateBatch("moveToFolder", { folderId }, ids),
    [mutateBatch]
  );

  return {
    copiedId,
    actionLoading,
    confirmDel,
    setConfirmDel,
    handleCopy,
    pause,
    resume,
    disable,
    hardDelete,
    handleConfirmDelete,
    mutateBatch,
    onMoveFolder,
    handleDropMove,
  };
}

"use client";

import { useCallback, useState } from "react";

const DEFAULT_TIMEOUT = 2000;

export const useClipboard = () => {
    const [copied, setCopied] = useState(false);

    const fallback = (text, id) => {
        try {
            const textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.position = "absolute";
            textArea.style.left = "-99999px";

            document.body.appendChild(textArea);
            textArea.select();

            const success = document.execCommand("copy");
            textArea.remove();

            setCopied(id || true);
            setTimeout(() => setCopied(false), DEFAULT_TIMEOUT);

            return success ? { success: true } : { success: false, error: new Error("execCommand returned false") };
        } catch (err) {
            return {
                success: false,
                error: err instanceof Error ? err : new Error("Fallback copy failed"),
            };
        }
    };

    const copy = useCallback(async (text, id) => {
        if (navigator.clipboard && window.isSecureContext) {
            try {
                await navigator.clipboard.writeText(text);

                setCopied(id || true);
                setTimeout(() => setCopied(false), DEFAULT_TIMEOUT);

                return { success: true };
            } catch {
                return fallback(text, id);
            }
        }
        return fallback(text, id);
    }, []);

    return { copied, copy };
};

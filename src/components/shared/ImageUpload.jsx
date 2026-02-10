import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

/**
 * Reusable Image Upload + Delete component
 *
 * Props:
 * - label?: string
 * - folder: string
 * - uploadEndpoint: string
 * - deleteEndpoint?: string   (optional; if your backend supports deleting by url or key)
 * - value?: string           (current image url)
 * - onChange: ({ url, file }) => void
 * - autoUpload?: boolean     (default true)
 * - disabled?: boolean
 */
export default function ImageUpload({
    label = "Image",
    folder,
    uploadEndpoint,
    deleteEndpoint,
    value = "",
    onChange,
    autoUpload = true,
    disabled = false,
}) {
    const inputRef = useRef(null);

    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null); // local objectURL for picked file
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const saving = disabled || isUploading || isDeleting;

    // show preview:
    // - if user picked a file -> show objectURL
    // - else if value exists -> show remote URL
    useEffect(() => {
        if (!file) {
            setPreview(null);
            return;
        }
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [file]);

    const uploadImage = async (pickedFile) => {
        const fd = new FormData();
        fd.append("folder", folder);
        fd.append("file", pickedFile);

        const res = await fetch(uploadEndpoint, { method: "POST", body: fd });
        if (!res.ok) throw new Error(`Upload failed: ${res.status}`);

        const json = await res.json();
        if (typeof json === "string") return json;
        if (json?.url) return json.url;
        throw new Error("Unexpected upload response");
    };

    // OPTIONAL delete call (depends on your backend)
    // This implementation tries:
    // - POST { url } to deleteEndpoint
    const deleteImage = async (path) => {
        const url = `${deleteEndpoint}?url=${encodeURIComponent(
            path
        )}`;
        if (!deleteEndpoint) return;
        const res = await fetch(url, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
    };

    const handlePick = async (e) => {
        const picked = e.target.files?.[0] || null;
        setFile(picked);

        // if no file, do nothing
        if (!picked) return;

        // if parent wants file immediately
        onChange?.({ url: value || "", file: picked });

        if (!autoUpload) return;

        try {
            setIsUploading(true);
            const url = await uploadImage(picked);
            toast.success("Image uploaded");
            onChange?.({ url, file: picked });
        } catch (err) {
            toast.error(`Failed: ${err.message}`);
        } finally {
            setIsUploading(false);
        }
    };

    const handleUploadClick = async () => {
        if (!file) {
            toast.error("Pick an image first.");
            return;
        }
        try {
            setIsUploading(true);
            const url = await uploadImage(file);
            toast.success("Image uploaded");
            onChange?.({ url, file });
        } catch (err) {
            toast.error(`Failed: ${err.message}`);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async () => {
        // If you already uploaded and have a URL, optionally delete it from backend
        const currentUrl = value;

        try {
            setIsDeleting(true);
            if (currentUrl && deleteEndpoint) {
                await deleteImage(currentUrl);
                toast.success("Image deleted");
            }

            // clear local state + input
            setFile(null);
            setPreview(null);
            if (inputRef.current) inputRef.current.value = "";

            // notify parent
            onChange?.({ url: "", file: null });
        } catch (err) {
            toast.error(`Failed: ${err.message}`);
        } finally {
            setIsDeleting(false);
        }
    };

    const displaySrc = preview || value || "";

    return (
        <div className="grid gap-3">
            <div className="flex items-center justify-between">
                <Label>{label}</Label>

                {(displaySrc || file) && (
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={saving}
                    >
                        Delete
                    </Button>
                )}
            </div>

            {displaySrc ? (
                <img
                    src={displaySrc}
                    alt="Preview"
                    className="w-full h-40 object-cover rounded-md border"
                />
            ) : (
                <div className="w-full h-40 rounded-md border flex items-center justify-center text-sm text-muted-foreground">
                    No image selected
                </div>
            )}

            <Input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handlePick}
                disabled={saving}
            />

            {!autoUpload && (
                <Button
                    type="button"
                    onClick={handleUploadClick}
                    disabled={saving || !file}
                >
                    {isUploading ? "Uploading..." : "Upload"}
                </Button>
            )}
        </div>
    );
}

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function ImageUploader({
    folder,
    uploadEndpoint = "https://mediaup.mentrmdcat.com/upload/",
    deleteEndpoint = "https://mediaup.mentrmdcat.com/delete/",
    onUploadSuccess,
    onDeleteSuccess,
    previewImg,
    setFormData,
}) {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(previewImg);
    const [uploadedUrl, setUploadedUrl] = useState("");
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);




    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        if (selectedFile) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(selectedFile);
        } else {
            setPreview(null);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setStatus("Select a file first");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append("folder", folder);
        formData.append("file", file);

        try {
            const res = await fetch(uploadEndpoint, {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error(`Error: ${res.status}`);
            const data = await res.json();
            setUploadedUrl(data.url);
            setStatus(`Uploaded: ${data.url}`);
            if (onUploadSuccess) onUploadSuccess(data.url);
        } catch (err) {
            setStatus("Upload failed: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!uploadedUrl) {
            setStatus("No uploaded image to delete");
            return;
        }

        setLoading(true);
        try {
            const url = new URL(deleteEndpoint);
            url.searchParams.append("url", uploadedUrl);

            const res = await fetch(url.toString(), { method: "DELETE" });

            if (!res.ok) throw new Error(`Error: ${res.status}`);

            const result = await res.json();
            setStatus(`Deleted: ${result}`);
            setUploadedUrl("");
            setPreview(null);
            if (onDeleteSuccess) onDeleteSuccess(result);
        } catch (err) {
            setStatus("Delete failed: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setFile(null);
        setPreview(null);
        setUploadedUrl("");
        setStatus("");
    };

    return (
        <Card className="max-w-sm mx-auto p-4">
            <CardHeader>
                <CardTitle>Image Uploader</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="space-y-2">
                    <Label htmlFor="file">Select an image</Label>
                    <Input
                        id="file"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={loading}
                    />
                </div>

                {preview && (
                    <div className="w-full">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-lg border"
                        />
                    </div>
                )}

                <div className="flex flex-wrap gap-2">
                    <Button onClick={handleUpload} disabled={loading}>
                        {loading ? "Uploading..." : "Upload"}
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={handleReset}
                        disabled={loading}
                    >
                        Reset
                    </Button>
                    {uploadedUrl && (
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={loading}
                        >
                            {loading ? "Deleting..." : "Delete"}
                        </Button>
                    )}
                </div>

                {status && (
                    <p className="text-sm text-muted-foreground break-words">{status}</p>
                )}
            </CardContent>
        </Card>
    );
}

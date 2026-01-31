import { useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { useMutation } from "@tanstack/react-query";
import { Camera, Upload, X, Loader2, Check } from "lucide-react";
import { cn } from "@shared/lib/styles";
import { uploadAvatar } from "@shared/lib/api";
import Avatar from "../list/Avatar";
import { AvatarUploadProps } from "./utils/__types__";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const SUCCESS_TIMEOUT = 2000;

const AvatarUpload = ({
  currentAvatarUrl,
  firstName,
  lastName,
  onUpload,
  inactive = false,
}: AvatarUploadProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const url = await uploadAvatar(file);
      await onUpload(url);
      return url;
    },
    onSuccess: () => {
      setSuccess(true);
      setTimeout(() => setSuccess(false), SUCCESS_TIMEOUT);
    },
    onError: () => {
      setPreviewUrl(null);
    },
  });

  const handleFileDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setValidationError(null);
    uploadMutation.reset();

    // Generate preview
    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target?.result as string);
    reader.readAsDataURL(file);

    uploadMutation.mutate(file);
  };

  const handleFileRejection = (rejections: FileRejection[]) => {
    const rejection = rejections[0];
    if (!rejection) return;

    const error = rejection.errors[0];
    if (error?.code === "file-too-large") {
      setValidationError("Image must be less than 5MB");
    } else if (error?.code === "file-invalid-type") {
      setValidationError("Please select an image file");
    } else {
      setValidationError(error?.message || "Invalid file");
    }
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: { "image/*": [] },
    maxSize: MAX_FILE_SIZE,
    multiple: false,
    disabled: uploadMutation.isPending,
    onDrop: handleFileDrop,
    onDropRejected: handleFileRejection,
    noClick: false,
    noKeyboard: false,
  });

  const clearError = () => {
    setValidationError(null);
    uploadMutation.reset();
  };

  const displayUrl = previewUrl || currentAvatarUrl;
  const error = validationError || uploadMutation.error?.message;
  const isUploading = uploadMutation.isPending;

  return (
    <div className="relative group overflow-visible">
      <div
        {...getRootProps({
          className: cn(
            "relative overflow-hidden border-4 shadow-lg transition-all duration-200 cursor-pointer",
            isDragActive
              ? "border-sky-400 scale-105"
              : "border-surface hover:border-sky-500/50",
            isUploading && "opacity-75",
          ),
        })}
      >
        <input {...getInputProps()} />

        <Avatar
          src={displayUrl}
          firstName={firstName}
          lastName={lastName}
          size="xl"
          inactive={inactive}
        />

        {!isUploading && (
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Camera className="w-8 h-8 text-white" />
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        )}

        {success && !isUploading && (
          <div className="absolute inset-0 bg-green-500/50 flex items-center justify-center animate-pulse">
            <Check className="w-8 h-8 text-white" />
          </div>
        )}
      </div>

      {!isUploading && (
        <button
          type="button"
          onClick={open}
          className="absolute -bottom-1 -right-1 w-8 h-8 bg-surface shadow-md flex items-center justify-center border border-border hover:bg-elevated transition-colors cursor-pointer"
          title="Upload image"
        >
          <Upload className="w-4 h-4 text-muted" />
        </button>
      )}

      {error && (
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 z-50 px-3 py-1.5 bg-red-600 text-white text-xs whitespace-nowrap flex items-center gap-1 shadow-lg">
          <span>{error}</span>
          <button onClick={clearError} className="ml-1 hover:bg-red-700 p-0.5">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {isDragActive && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-28 h-28 border-2 border-dashed border-sky-400 animate-pulse" />
        </div>
      )}
    </div>
  );
};

export default AvatarUpload;

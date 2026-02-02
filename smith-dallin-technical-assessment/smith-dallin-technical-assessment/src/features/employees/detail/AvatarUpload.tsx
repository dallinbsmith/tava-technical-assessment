import { useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { useMutation } from "@tanstack/react-query";
import { Camera, Upload, X, Loader2, Check } from "lucide-react";
import { cn } from "@shared/lib/styles";
import { uploadAvatar } from "@shared/lib/api";
import Avatar from "../list/Avatar";
import { AvatarUploadProps } from "../__types__";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const SUCCESS_DISPLAY_MS = 2000;

const HoverOverlay = () => (
  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
    <Camera className="w-8 h-8 text-white" />
  </div>
);

const UploadingOverlay = () => (
  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
    <Loader2 className="w-8 h-8 text-white animate-spin" />
  </div>
);

const SuccessOverlay = () => (
  <div className="absolute inset-0 bg-green-500/50 flex items-center justify-center animate-pulse">
    <Check className="w-8 h-8 text-white" />
  </div>
);

const DragOverlay = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
    <div className="w-28 h-28 border-2 border-dashed border-sky-400 animate-pulse" />
  </div>
);

const ErrorToast = ({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss: () => void;
}) => (
  <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 z-50 px-3 py-1.5 bg-red-600 text-white text-xs whitespace-nowrap flex items-center gap-1 shadow-lg">
    <span>{message}</span>
    <button onClick={onDismiss} className="ml-1 hover:bg-red-700 p-0.5">
      <X className="w-3 h-3" />
    </button>
  </div>
);

const getValidationError = (rejection: FileRejection): string => {
  const error = rejection.errors[0];
  if (error?.code === "file-too-large") return "Image must be less than 5MB";
  if (error?.code === "file-invalid-type") return "Please select an image file";
  return error?.message || "Invalid file";
};

const AvatarUpload = ({
  currentAvatarUrl,
  firstName,
  lastName,
  onUpload,
  inactive = false,
}: AvatarUploadProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const url = await uploadAvatar(file);
      await onUpload(url);
      return url;
    },
    onSuccess: () => {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), SUCCESS_DISPLAY_MS);
    },
    onError: () => {
      setPreviewUrl(null);
    },
  });

  const handleDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setValidationError(null);
    uploadMutation.reset();

    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target?.result as string);
    reader.readAsDataURL(file);

    uploadMutation.mutate(file);
  };

  const handleRejection = (rejections: FileRejection[]) => {
    if (rejections[0]) {
      setValidationError(getValidationError(rejections[0]));
    }
  };

  const dismissError = () => {
    setValidationError(null);
    uploadMutation.reset();
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: { "image/*": [] },
    maxSize: MAX_FILE_SIZE,
    multiple: false,
    disabled: uploadMutation.isPending,
    onDrop: handleDrop,
    onDropRejected: handleRejection,
  });

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

        {!isUploading && !showSuccess && <HoverOverlay />}
        {isUploading && <UploadingOverlay />}
        {showSuccess && !isUploading && <SuccessOverlay />}
        {isDragActive && <DragOverlay />}
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

      {error && <ErrorToast message={error} onDismiss={dismissError} />}
    </div>
  );
};

export default AvatarUpload;

import { useState } from "react";
import { cn } from "../../../shared/lib/styles";
import { AvatarProps, AvatarSize } from "../__types__";

const sizeClasses: Record<AvatarSize, { container: string; text: string }> = {
  sm: { container: "w-8 h-8", text: "text-xs" },
  md: { container: "w-10 h-10", text: "text-sm" },
  lg: { container: "w-14 h-14", text: "text-lg" },
  xl: { container: "w-24 h-24", text: "text-3xl" },
};

const Avatar = ({
  src,
  firstName,
  lastName,
  size = "md",
  className,
  inactive = false,
}: AvatarProps) => {
  const [imgError, setImgError] = useState(false);
  const { container, text } = sizeClasses[size];
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  const showImage = src && !imgError;

  return (
    <div
      className={cn(
        container,
        "flex-shrink-0 relative overflow-hidden",
        !showImage && "bg-gradient-to-br from-sky-400 to-sky-600",
        inactive && "grayscale",
        className,
      )}
    >
      {showImage ? (
        <img
          src={src}
          alt={`${firstName} ${lastName}`}
          className="object-cover w-full h-full"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn(text, "font-bold text-white")}>{initials}</span>
        </div>
      )}
    </div>
  );
};

export default Avatar;

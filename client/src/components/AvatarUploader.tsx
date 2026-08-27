import { useRef, useState, useEffect } from "react";
import { trpc } from "../lib/trpc";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AvatarUploader({ 
  id, 
  type, 
  currentPicture, 
  initials, 
  size = "md",
  editable = true
}: { 
  id?: string, 
  type?: string, 
  currentPicture?: string, 
  initials: string,
  size?: "sm" | "md" | "lg" | "xl" | "xxl",
  editable?: boolean
}) {
  const isValid = (p?: string) => p && p.trim().length > 5 ? p : undefined;
  const [preview, setPreview] = useState(isValid(currentPicture));
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    setPreview(isValid(currentPicture));
  }, [currentPicture]);
  
  const utils = trpc.useContext();
  const uploadMutation = trpc.school.updateProfilePicture.useMutation({
    onSuccess: () => {
      toast.success("Profile picture updated!");
      utils.auth.me.invalidate();
      utils.school.dashboard.invalidate();
    },
    onError: (err) => {
      toast.error(err.message);
      setPreview(currentPicture); // revert on error
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File is too large. Max size is 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setPreview(base64);
      uploadMutation.mutate({ id, type, base64Image: base64 });
    };
    reader.readAsDataURL(file);
  };

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-16 h-16 text-xl",
    xl: "w-24 h-24 text-3xl",
    xxl: "w-32 h-32 text-4xl"
  };

  return (
    <div className={`relative group inline-block ${sizeClasses[size]} shrink-0 rounded-full bg-[#1b4332] text-white flex items-center justify-center font-bold overflow-hidden shadow-sm border-2 border-white`}>
      {preview ? (
        <img src={preview} alt="Profile" className="w-full h-full object-cover" />
      ) : (
        <span>{initials}</span>
      )}
      
      {editable && (
        <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
          {uploadMutation.isPending ? <Loader2 size={size === 'sm' ? 12 : 20} className="animate-spin text-white" /> : <Camera size={size === 'sm' ? 12 : 20} className="text-white" />}
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileChange}
            disabled={uploadMutation.isPending}
          />
        </label>
      )}
    </div>
  );
}

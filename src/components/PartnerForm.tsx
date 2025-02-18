
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Partner } from "@/types/partner";
import { ImagePreview } from "./partner/ImagePreview";
import { PartnerFormFields } from "./partner/PartnerFormFields";

interface PartnerFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  partner?: Partner;
}

export const PartnerForm = ({ open, onOpenChange, onSuccess, partner }: PartnerFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [currentImages, setCurrentImages] = useState<{ url: string }[]>([]);
  const [audio, setAudio] = useState<File | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (partner) {
      setName(partner.name);
      setAge(partner.age?.toString() || "");
      setLocation(partner.location || "");
      setNotes(partner.notes || "");
      setCurrentImages(partner.images || []);
    } else {
      setName("");
      setAge("");
      setLocation("");
      setNotes("");
      setImages([]);
      setCurrentImages([]);
      setAudio(null);
    }
  }, [partner]);

  const handleImageReorder = (fromIndex: number, toIndex: number) => {
    const newImages = [...currentImages];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    setCurrentImages(newImages);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let uploadedImages = [];

      // Upload new images
      for (const image of images) {
        const fileExt = image.name.split('.').pop();
        const filePath = `${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('partner-images')
          .upload(filePath, image);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('partner-images')
          .getPublicUrl(filePath);

        uploadedImages.push({ url: publicUrl });
      }

      let audioUrl = null;

      if (audio) {
        const fileExt = audio.name.split('.').pop();
        const filePath = `${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('partner-audio')
          .upload(filePath, audio);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('partner-audio')
          .getPublicUrl(filePath);

        audioUrl = publicUrl;
      }

      const partnerData = {
        name,
        age: age ? parseInt(age) : null,
        location,
        notes,
        images: [...currentImages, ...uploadedImages],
        ...(audioUrl ? { audio_url: audioUrl } : {}),
        user_id: (await supabase.auth.getUser()).data.user?.id
      };

      if (partner) {
        const { error } = await supabase
          .from('partner')
          .update(partnerData)
          .eq('id', partner.id);

        if (error) throw error;

        toast({
          title: "更新完了",
          description: "パートナー情報を更新しました",
        });
      } else {
        const { error } = await supabase
          .from('partner')
          .insert(partnerData);

        if (error) throw error;

        toast({
          title: "保存完了",
          description: "パートナー情報を保存しました",
        });
      }
      
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "エラー",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {partner ? "パートナー情報の編集" : "パートナー情報の追加"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <PartnerFormFields
            name={name}
            setName={setName}
            age={age}
            setAge={setAge}
            location={location}
            setLocation={setLocation}
            notes={notes}
            setNotes={setNotes}
            setImages={setImages}
            setAudio={setAudio}
          />
          <ImagePreview
            images={currentImages}
            onReorder={handleImageReorder}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "保存中..." : (partner ? "更新" : "保存")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

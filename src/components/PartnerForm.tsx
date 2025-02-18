
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Partner {
  id: number;
  name: string;
  age: number | null;
  location: string | null;
  notes: string | null;
  image_url: string | null;
}

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
  const [image, setImage] = useState<File | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (partner) {
      setName(partner.name);
      setAge(partner.age?.toString() || "");
      setLocation(partner.location || "");
      setNotes(partner.notes || "");
    } else {
      setName("");
      setAge("");
      setLocation("");
      setNotes("");
      setImage(null);
    }
  }, [partner]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let imageUrl = null;

      if (image) {
        const fileExt = image.name.split('.').pop();
        const filePath = `${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('partner-images')
          .upload(filePath, image);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('partner-images')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      const partnerData = {
        name,
        age: age ? parseInt(age) : null,
        location,
        notes,
        ...(imageUrl ? { image_url: imageUrl } : {}),
        user_id: (await supabase.auth.getUser()).data.user?.id
      };

      if (partner) {
        // 更新
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
        // 新規作成
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {partner ? "パートナー情報の編集" : "パートナー情報の追加"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">名前</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="age">年齢</Label>
            <Input
              id="age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">場所</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">メモ</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">画像</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "保存中..." : (partner ? "更新" : "保存")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};


import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface PartnerFormFieldsProps {
  name: string;
  setName: (name: string) => void;
  age: string;
  setAge: (age: string) => void;
  location: string;
  setLocation: (location: string) => void;
  notes: string;
  setNotes: (notes: string) => void;
  setImages: (files: File[]) => void;
  setAudio: (file: File | null) => void;
}

export const PartnerFormFields = ({
  name,
  setName,
  age,
  setAge,
  location,
  setLocation,
  notes,
  setNotes,
  setImages,
  setAudio,
}: PartnerFormFieldsProps) => {
  return (
    <>
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
        <Label htmlFor="images">画像（複数選択可）</Label>
        <Input
          id="images"
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setImages(Array.from(e.target.files || []))}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="audio">音声</Label>
        <Input
          id="audio"
          type="file"
          accept="audio/*"
          onChange={(e) => setAudio(e.target.files?.[0] || null)}
        />
      </div>
    </>
  );
};

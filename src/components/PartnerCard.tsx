
import { Partner } from "@/types/partner";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Music2, Image } from "lucide-react";

interface PartnerCardProps {
  partner: Partner;
  onEdit: (partner: Partner) => void;
  onDelete: (partner: Partner) => void;
}

export const PartnerCard = ({ partner, onEdit, onDelete }: PartnerCardProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        {partner.images && partner.images[0] && (
          <img
            src={partner.images[0].url}
            alt={partner.name}
            className="w-full h-48 object-cover rounded-md mb-4"
          />
        )}
        <h3 className="text-lg font-semibold mb-2">{partner.name}</h3>
        {partner.age && <p className="text-sm">年齢: {partner.age}歳</p>}
        {partner.location && (
          <p className="text-sm">場所: {partner.location}</p>
        )}
        {partner.notes && (
          <p className="text-sm text-muted-foreground mt-2">
            {partner.notes}
          </p>
        )}
        {partner.images && partner.images.length > 1 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
            <Image className="w-4 h-4" />
            <span>他 {partner.images.length - 1} 枚の画像</span>
          </div>
        )}
        {partner.audio_url && (
          <div className="mt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Music2 className="w-4 h-4" />
              <span>録音</span>
            </div>
            <audio controls className="w-full">
              <source src={partner.audio_url} type="audio/mpeg" />
              お使いのブラウザは音声再生をサポートしていません。
            </audio>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2 p-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onEdit(partner)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="destructive"
          size="icon"
          onClick={() => onDelete(partner)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

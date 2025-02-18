
import { Label } from "@/components/ui/label";

interface ImagePreviewProps {
  images: { url: string }[];
  onReorder: (fromIndex: number, toIndex: number) => void;
}

export const ImagePreview = ({ images, onReorder }: ImagePreviewProps) => {
  if (images.length === 0) return null;

  return (
    <div className="space-y-2">
      <Label>現在の画像（クリックすると表示順を変更できます）</Label>
      <div className="grid grid-cols-2 gap-2">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative cursor-pointer transition-transform hover:scale-105"
            onClick={() => {
              if (index !== 0) {
                onReorder(index, 0);
              }
            }}
          >
            <img
              src={image.url}
              alt={`画像 ${index + 1}`}
              className={`w-full h-24 object-cover rounded ${index === 0 ? 'ring-2 ring-primary' : ''}`}
            />
            {index === 0 && (
              <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded">
                メイン
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

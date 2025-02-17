
import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Pencil, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MediaItemProps {
  item: {
    id: string;
    name: string;
    type: string;
    url: string;
    createdAt: Date;
  };
  onDelete: (id: string) => void;
  onEdit: (id: string, newName: string) => void;
}

export const MediaItem = ({ item, onDelete, onEdit }: MediaItemProps) => {
  const [showPreview, setShowPreview] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(item.name);

  const handleEdit = () => {
    onEdit(item.id, newName);
    setIsEditing(false);
  };

  const renderPreview = () => {
    if (item.type.startsWith("image/")) {
      return (
        <img
          src={item.url}
          alt={item.name}
          className="w-full h-32 object-cover rounded-md"
          loading="lazy"
        />
      );
    } else if (item.type.startsWith("audio/")) {
      return (
        <audio controls className="w-full mt-2">
          <source src={item.url} type={item.type} />
        </audio>
      );
    }
    return (
      <div className="w-full h-32 flex items-center justify-center bg-accent rounded-md">
        <span className="text-sm text-muted-foreground">{item.type}</span>
      </div>
    );
  };

  return (
    <>
      <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-md">
        <CardContent className="p-4">
          <div
            className="cursor-pointer"
            onClick={() => setShowPreview(true)}
          >
            {renderPreview()}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          {isEditing ? (
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={handleEdit}
              onKeyDown={(e) => e.key === "Enter" && handleEdit()}
              className="flex-1 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary/20"
              autoFocus
            />
          ) : (
            <span className="text-sm truncate flex-1">{item.name}</span>
          )}
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive"
              onClick={() => onDelete(item.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>{item.name}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {renderPreview()}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

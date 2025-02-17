
import { useState } from "react";
import { MediaItem } from "@/components/MediaItem";
import { DropZone } from "@/components/DropZone";
import { useToast } from "@/hooks/use-toast";

interface MediaFile {
  id: string;
  name: string;
  type: string;
  url: string;
  createdAt: Date;
}

const Index = () => {
  const [items, setItems] = useState<MediaFile[]>([]);
  const { toast } = useToast();

  const handleDrop = (acceptedFiles: File[]) => {
    const newItems = acceptedFiles.map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file),
      createdAt: new Date(),
    }));

    setItems((prev) => [...prev, ...newItems]);
    toast({
      title: "Files uploaded",
      description: `Successfully uploaded ${acceptedFiles.length} file(s)`,
    });
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    toast({
      title: "File deleted",
      description: "The file has been successfully deleted",
    });
  };

  const handleEdit = (id: string, newName: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, name: newName } : item
      )
    );
    toast({
      title: "File renamed",
      description: "The file has been successfully renamed",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Media Library</h1>
        <p className="text-muted-foreground">
          Upload, manage, and organize your media files
        </p>
      </div>

      <DropZone onDrop={handleDrop} />

      <div className="mt-12">
        {items.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            No files uploaded yet. Drop some files to get started!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <MediaItem
                key={item.id}
                item={item}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;

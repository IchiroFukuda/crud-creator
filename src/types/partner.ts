
export interface Partner {
  id: number;
  name: string;
  age: number | null;
  location: string | null;
  notes: string | null;
  images: { url: string }[];
  audio_url: string | null;
}


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PartnerForm } from "@/components/PartnerForm";
import { Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { PartnerCard } from "@/components/PartnerCard";
import { Partner } from "@/types/partner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Index = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | undefined>();
  const [deletePartner, setDeletePartner] = useState<Partner | undefined>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchPartners = async () => {
    try {
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from('partner')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedPartners: Partner[] = (data || []).map(partner => {
        const rawImages = partner.images;
        let formattedImages: { url: string }[] = [];
        
        if (Array.isArray(rawImages)) {
          formattedImages = rawImages.map(img => {
            if (typeof img === 'object' && img !== null && 'url' in img) {
              return { url: img.url as string };
            }
            return { url: '' };
          }).filter(img => img.url !== '');
        }

        return {
          id: partner.id,
          name: partner.name || "",
          age: partner.age,
          location: partner.location,
          notes: partner.notes,
          images: formattedImages,
          audio_url: partner.audio_url || null // この行を修正
        };
      });

      setPartners(formattedPartners);
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

  useEffect(() => {
    fetchPartners();
  }, [user]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "エラー",
        description: error.message,
        variant: "destructive",
      });
    } else {
      navigate("/auth");
    }
  };

  const handleDelete = async () => {
    if (!deletePartner) return;

    try {
      const { error } = await supabase
        .from('partner')
        .delete()
        .eq('id', deletePartner.id);

      if (error) throw error;

      toast({
        title: "削除完了",
        description: "パートナー情報を削除しました",
      });

      fetchPartners();
    } catch (error: any) {
      toast({
        title: "エラー",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeletePartner(undefined);
    }
  };

  const handleEdit = (partner: Partner) => {
    setSelectedPartner(partner);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedPartner(undefined);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col gap-6 sm:flex-row sm:justify-between sm:items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">パートナー一覧</h1>
          <p className="text-muted-foreground">
            パートナー情報の管理・閲覧ができます
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={() => setShowForm(true)} className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            新規追加
          </Button>
          <Button variant="outline" onClick={handleLogout} className="w-full sm:w-auto">
            ログアウト
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">読み込み中...</div>
      ) : partners.length === 0 ? (
        <div className="text-center text-muted-foreground py-12">
          パートナー情報がありません。「新規追加」から登録してください。
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {partners.map((partner) => (
            <PartnerCard
              key={partner.id}
              partner={partner}
              onEdit={handleEdit}
              onDelete={setDeletePartner}
            />
          ))}
        </div>
      )}

      <PartnerForm
        open={showForm}
        onOpenChange={handleCloseForm}
        onSuccess={fetchPartners}
        partner={selectedPartner}
      />

      <AlertDialog open={!!deletePartner} onOpenChange={() => setDeletePartner(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>本当に削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              この操作は取り消すことができません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              削除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;

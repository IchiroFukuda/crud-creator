
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PartnerForm } from "@/components/PartnerForm";
import { useAuth } from "@/contexts/AuthContext";
import { Partner } from "@/types/partner";
import { HeaderSection } from "@/components/partner/HeaderSection";
import { PartnerList } from "@/components/partner/PartnerList";
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
          audio_url: partner.audio_url || null
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
  }, []);

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
    if (!user) {
      toast({
        title: "ログインが必要です",
        description: "編集機能を使用するにはログインしてください",
        variant: "destructive",
      });
      return;
    }
    setSelectedPartner(partner);
    setShowForm(true);
  };

  const handleAddNew = () => {
    if (!user) {
      toast({
        title: "ログインが必要です",
        description: "新規追加機能を使用するにはログインしてください",
        variant: "destructive",
      });
      return;
    }
    setShowForm(true);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <HeaderSection
        user={user}
        onAddNew={handleAddNew}
        onLogin={() => navigate("/auth")}
        onLogout={handleLogout}
      />

      {isLoading ? (
        <div className="text-center py-12">読み込み中...</div>
      ) : (
        <PartnerList
          partners={partners}
          user={user}
          onEdit={handleEdit}
          onDelete={setDeletePartner}
        />
      )}

      <PartnerForm
        open={showForm}
        onOpenChange={(open) => {
          setShowForm(open);
          if (!open) setSelectedPartner(undefined);
        }}
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

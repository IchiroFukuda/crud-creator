
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PartnerForm } from "@/components/PartnerForm";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Partner {
  id: number;
  name: string;
  age: number | null;
  location: string | null;
  notes: string | null;
  image_url: string | null;
}

const Index = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
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
      setPartners(data || []);
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">パートナー一覧</h1>
          <p className="text-muted-foreground">
            パートナー情報の管理・閲覧ができます
          </p>
        </div>
        <div className="flex gap-4">
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            新規追加
          </Button>
          <Button variant="outline" onClick={handleLogout}>
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
            <Card key={partner.id}>
              <CardContent className="p-4">
                {partner.image_url && (
                  <img
                    src={partner.image_url}
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
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <PartnerForm
        open={showForm}
        onOpenChange={setShowForm}
        onSuccess={fetchPartners}
      />
    </div>
  );
};

export default Index;


import { Partner } from "@/types/partner";
import { PartnerCard } from "@/components/PartnerCard";
import { User } from "@supabase/supabase-js";

interface PartnerListProps {
  partners: Partner[];
  user: User | null;
  onEdit: (partner: Partner) => void;
  onDelete: (partner: Partner) => void;
}

export const PartnerList = ({ partners, user, onEdit, onDelete }: PartnerListProps) => {
  if (partners.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-12">
        パートナー情報がありません。
        {user ? (
          '「新規追加」から登録してください。'
        ) : (
          'ログインして新規追加することができます。'
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {partners.map((partner) => (
        <PartnerCard
          key={partner.id}
          partner={partner}
          onEdit={onEdit}
          onDelete={user ? onDelete : undefined}
        />
      ))}
    </div>
  );
};

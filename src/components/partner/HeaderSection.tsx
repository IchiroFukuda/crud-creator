
import { Button } from "@/components/ui/button";
import { Plus, LogIn } from "lucide-react";
import { User } from "@supabase/supabase-js";

interface HeaderSectionProps {
  user: User | null;
  onAddNew: () => void;
  onLogin: () => void;
  onLogout: () => void;
}

export const HeaderSection = ({ user, onAddNew, onLogin, onLogout }: HeaderSectionProps) => {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:justify-between sm:items-center mb-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">パートナー一覧</h1>
        <p className="text-muted-foreground">
          パートナー情報の管理・閲覧ができます
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        {user ? (
          <>
            <Button onClick={onAddNew} className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              新規追加
            </Button>
            <Button variant="outline" onClick={onLogout} className="w-full sm:w-auto">
              ログアウト
            </Button>
          </>
        ) : (
          <Button onClick={onLogin} className="w-full sm:w-auto">
            <LogIn className="w-4 h-4 mr-2" />
            ログイン
          </Button>
        )}
      </div>
    </div>
  );
};

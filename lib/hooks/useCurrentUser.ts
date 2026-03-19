import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

type CurrentUser = {
  id: string;
  name: string;
  email: string;
  role: string;
} | null;

export const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState<CurrentUser>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setLoading(false); return; }

      const { data } = await supabase
        .from("users")
        .select("id, name, email, role")
        .eq("auth_id", session.user.id)
        .single();

      setCurrentUser(data ?? null);
      setLoading(false);
    };

    fetchUser();

    // Keep in sync on auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchUser();
    });

    return () => subscription.unsubscribe();
  }, []);

  return { currentUser, loading };
};
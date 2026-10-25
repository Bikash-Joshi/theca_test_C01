import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AccountView from "./AccountView";

async function Account() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, address, phone")
    .eq("id", user.id)
    .single();

  return (
    <AccountView
      email={user.email ?? ""}
      name={profile?.name ?? user.user_metadata?.name ?? ""}
      address={profile?.address ?? user.user_metadata?.address ?? ""}
      phone={profile?.phone ?? user.user_metadata?.phone ?? ""}
    />
  );
}

export default function AccountPage() {
  return (
    <Suspense>
      <Account />
    </Suspense>
  );
}

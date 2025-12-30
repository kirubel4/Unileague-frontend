// app/(private)/manager/matches/page.tsx
"use client";
import { Layout } from "@/components/Layout";
import { MatchList } from "@/components/pages/MatchList";
import { getCookie } from "@/lib/utils";

export default function ManagerMatches() {
  const userName = getCookie("uName") || "Manager";

  return (
    <Layout role="manager" userName={userName}>
      <MatchList
        mode="admin"
        title="Tournament Matches"
        description="Monitor and manage all tournament matches"
        apiEndpoint="/api/public/match"
        className="mt-8"
      />
    </Layout>
  );
}

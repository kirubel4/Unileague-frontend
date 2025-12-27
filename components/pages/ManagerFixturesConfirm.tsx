import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";

import { ChevronLeft, CheckCircle } from "lucide-react";
import { useState } from "react";
import { Match, Team, TournamentFormat } from "./ManagerFixturesSetup";
import { useRouter } from "next/navigation";
import { MatchWeekPreview } from "@/app/(private)/manager/fixtures/setup/page";

type Props = {
  format: TournamentFormat;
  selectedTeams: Team[];
  matches: MatchWeekPreview[];
  onBack: () => void;
};

export default function ManagerFixturesConfirm({
  format,
  selectedTeams,
  matches,
  onBack,
}: Props) {
  const userName = localStorage.getItem("userName") || "Manager";
  const navigate = useRouter();
  const [isConfirming, setIsConfirming] = useState(false);

  // ---- safety guards (DO NOT BREAK UI) ----
  if (!format || selectedTeams.length === 0 || matches.length === 0) {
    return (
      <Layout role="manager" userName={userName}>
        <div className="p-6 bg-muted rounded-lg text-center">
          <p className="text-muted-foreground mb-4">
            Fixture data is missing. Please go back and complete previous steps.
          </p>
          <Button onClick={onBack}>Go Back</Button>
        </div>
      </Layout>
    );
  }

  const handleConfirm = async () => {
    setIsConfirming(true);

    // fake API delay
    setTimeout(() => {
      alert(
        `Fixtures created successfully! ${matches.length} matches have been generated.`
      );
      navigate.push("/manager/fixtures");
    }, 800);
  };

  return (
    <Layout role="manager" userName={userName}>
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" size="sm" className="mb-4" onClick={onBack}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Fixtures
        </Button>

        <h1 className="text-3xl font-bold text-foreground">Confirm Fixtures</h1>
        <p className="text-muted-foreground mt-2">
          Step 4 of 4: Finalize fixture creation
        </p>
      </div>

      {/* Confirmation Card */}
      <div className="max-w-7xl">
        <div className="bg-white rounded-lg border border-border p-6 sm:p-8">
          {/* Icon + title */}
          <div className="text-center mb-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Ready to Create Fixtures
            </h2>
            <p className="text-muted-foreground">
              All settings are configured. Confirm to create the fixtures.
            </p>
          </div>

          {/* Details */}
          <div className="space-y-4 mb-8 p-4 sm:p-6 bg-muted rounded-lg">
            <DetailRow label="Format" value={format} />
            <DetailRow label="Teams" value={selectedTeams.length.toString()} />
            <DetailRow
              label="Total Matches"
              value={matches
                .reduce((acc, w) => acc + w.matches.length, 0)
                .toString()}
            />
          </div>

          {/* Warning */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-8">
            <p className="text-sm text-yellow-800">
              ⚠️ Once confirmed, fixtures will be locked. You can edit
              individual matches but cannot regenerate the entire fixture list.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleConfirm}
              disabled={isConfirming}
              className="flex-1 bg-primary text-white rounded-lg h-10"
            >
              {isConfirming
                ? "Creating Fixtures..."
                : "Confirm & Create Fixtures"}
            </Button>

            <Button
              variant="outline"
              onClick={onBack}
              className="rounded-lg h-10"
            >
              Back
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

/* ----------------- Small helper (no UI change) ----------------- */
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-t border-border pt-4 first:border-t-0 first:pt-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  );
}

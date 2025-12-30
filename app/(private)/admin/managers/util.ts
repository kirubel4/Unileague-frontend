export interface ManagerTableRow {
  id: string;
  name: string;
  email: string;
  assignedTournament: string;
  status: string;
  joinDate: string;
}

export function mapManagersToTableRows(
  data: any[] | undefined | null
): ManagerTableRow[] {
  if (!Array.isArray(data)) return [];

  return data.map((m) => {
    const t = m?.tournaments?.[0] ?? null;

    return {
      id: m?.id ?? "",
      name: m?.fullName ?? "",
      email: m?.email ?? "",
      assignedTournament: t?.tournamentName ?? "None",
      status: t?.status ?? "N/A",
      joinDate: t?.startingDate?.substring(0, 10) ?? "N/A",
    };
  });
}

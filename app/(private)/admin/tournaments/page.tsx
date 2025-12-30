'use client';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ApiResponse, fetcher } from '@/lib/utils';
import { Trash2, Edit, Eye, Plus } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { mapTournaments } from './util';

interface Tournament {
  id: string;
  tournamentName: string;
  startingDate: string;
  endingDate: string;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED';
  teams?: number;
  managers?: number;
  logurl?: string;
}

export default function AdminTournaments() {
  const userName = 'Admin';
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  // const [error, setError] = useState<string | null>(null);

  
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'upcoming' | 'ongoing' | 'COMPLETED'
  >('all');

  const [yearFilter, setYearFilter] = useState<string>('all');

  const { data, error, isLoading } = useSWR('/api/public/tournament', fetcher, {
    revalidateOnFocus: false,
  });
  const tournaments: Tournament[] = mapTournaments(data);
  const filteredTournaments = tournaments
    .filter((t): t is Tournament => t != null)
    .filter(t => {
      const matchesSearch = (t.tournamentName?.toLowerCase() ?? '').includes(
        searchTerm.toLowerCase()
      );
      const matchesStatus =
        statusFilter === 'all' ||
        (t.status?.toLowerCase() ?? '') === statusFilter;
      const matchesYear =
        yearFilter === 'all' ||
        (new Date(t.startingDate).getFullYear() <= parseInt(yearFilter) &&
          new Date(t.endingDate).getFullYear() >= parseInt(yearFilter));

      return matchesSearch && matchesStatus && matchesYear;
    });

  const getStatusBadgeClass = (status?: string) => {
    switch ((status ?? '').toLowerCase()) {
      case 'ongoing':
        return 'status-ongoing';
      case 'upcoming':
        return 'status-scheduled';
      case 'completed':
        return 'status-finished';
      default:
        return 'status-pending';
    }
  };

  return (
    <Layout role="super_admin" userName={userName}>
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Tournaments
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Manage all tournaments in the system
          </p>
        </div>

        <Link href="/admin/tournaments/create" className="w-full sm:w-auto">
          <Button className="bg-primary text-white rounded-lg gap-2 w-full sm:w-auto">
            <Plus className="w-4 h-4" /> Create Tournament
          </Button>
        </Link>
      </div>

      {/* SEARCH & FILTER */}
      <div className="bg-white rounded-lg border border-border p-4 mb-6 flex flex-wrap gap-4">
        <Input
          placeholder="Search tournaments..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="flex-1 min-w-[200px]"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as any)}
          className="h-9 px-3 border border-border rounded-lg"
        >
          <option value="all">All Status</option>
          <option value="upcoming">Upcoming</option>
          <option value="ongoing">Ongoing</option>
          <option value="finished">Finished</option>
        </select>
        <select
          value={yearFilter}
          onChange={e => setYearFilter(e.target.value)}
          className="h-9 px-3 border border-border rounded-lg"
        >
          <option value="all">All Years</option>
          <option value="2022">2022</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
          <option value="2026">2026</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] md:min-w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                {[
                  'Name',
                  'Year',
                  'Status',
                  'Teams',
                  'Managers',
                  'Period',
                  'Actions',
                ].map(h => (
                  <th
                    key={h}
                    className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredTournaments.length > 0 ? (
                filteredTournaments.map((t, index) => (
                  <tr
                    key={`${t.id}-${index}`}
                    className="border-b border-border hover:bg-muted transition-colors"
                  >
                    <td className="py-2 px-4 text-sm font-medium">
                      {t.tournamentName ?? 'N/A'}
                    </td>
                    <td className="py-2 px-4 text-sm text-muted-foreground">
                      {t.startingDate
                        ? new Date(t.startingDate).getFullYear()
                        : 'N/A'}
                    </td>
                    <td className="py-2 px-4">
                      <span
                        className={`text-xs font-semibold ${getStatusBadgeClass(
                          t.status
                        )}`}
                      >
                        {t.status ?? '-'}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-sm">{t.teams ?? '1'}</td>
                    <td className="py-2 px-4 text-sm">{t.managers ?? '1'}</td>
                    <td className="py-2 px-4 text-sm">
                      {t.startingDate && t.endingDate
                        ? `${new Date(
                            t.startingDate
                          ).getFullYear()} - ${new Date(
                            t.endingDate
                          ).getFullYear()}`
                        : '-'}
                    </td>
                    <td className="py-2 px-4">
                      <div className="flex gap-2">
                        <Link href={`/admin/tournaments/${t.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>

                        <Link href={`/admin/tournaments/${t.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>

                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive"
                          onClick={() =>
                            alert('Delete tournament: ' + t.tournamentName)
                          }
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : isLoading ? (
                <tr>
                  <td
                    className="py-8 px-4 text-center text-muted-foreground"
                    colSpan={7}
                  >
                    Tournament data is loading...
                  </td>
                </tr>
              ) : (
                <tr>
                  <td
                    className="py-8 px-4 text-center text-muted-foreground"
                    colSpan={7}
                  >
                    No tournaments found matching your filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

"use client";
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import {
  Trophy,
  Users,
  Newspaper,
  Plus,
  TrendingUp,
  BarChart3,
} from 'lucide-react';
import Link from 'next/link';

interface StatCard {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: string;
}

interface DashboardStats {
  totalTournaments: number;
  activeTournaments: number;
  finishedTournaments: number;
  totalTeams: number;
  totalPlayers: number;
  totalManagers: number;
}
export default function AdminDashboard() {
  const userName = 'Admin';
  const [status, setStatus] = useState<DashboardStats | null >(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/protected/admin/tournament/');
        const json = await res.json();

        if (json.ok) {
          setStatus(json.data);
        }
      } catch (error) {
        console.error('Error fetching tournaments:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);
  if (!status) return <p className="p-4">No dashboard data found.</p>;
  const statCards: StatCard[] = [
    {
      label: 'Total Tournaments',
      value: status?.totalTournaments,
      icon: <Trophy className="w-6 h-6" />,
      color: 'bg-blue-50 text-blue-600',
      trend: '+3 this month',
    },
    {
      label: 'Active Tournaments',
      value: status.activeTournaments,
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-green-50 text-green-600',
      trend: '2 starting soon',
    },
    {
      label: 'Finished Tournaments',
      value: status.finishedTournaments,
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'bg-purple-50 text-purple-600',
      trend: 'Completed',
    },
    {
      label: 'Total Teams',
      value: status.totalTeams,
      icon: <Users className="w-6 h-6" />,
      color: 'bg-orange-50 text-orange-600',
      trend: '+12 registered',
    },
    {
      label: 'Total Players',
      value: status.totalPlayers,
      icon: <Users className="w-6 h-6" />,
      color: 'bg-pink-50 text-pink-600',
      trend: '+156 this month',
    },
    {
      label: 'Tournament Managers',
      value: status.totalManagers,
      icon: <Users className="w-6 h-6" />,
      color: 'bg-indigo-50 text-indigo-600',
      trend: 'All active',
    },
  ];

  const quickActions = [
    {
      label: 'Create Tournament',
      path: '/admin/tournaments/create',
      icon: <Trophy className="w-5 h-5" />,
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      label: 'Add Manager',
      path: '/admin/managers/create',
      icon: <Users className="w-5 h-5" />,
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      label: 'Publish News',
      path: '/admin/news/create',
      icon: <Newspaper className="w-5 h-5" />,
      color: 'bg-purple-500 hover:bg-purple-600',
    },
  ];

  return (
    <Layout role="super_admin" userName={userName}>
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-3xl  font-bold text-foreground">
          Welcome, {userName}!
        </h1>
        <p className="text-muted-foreground mt-2">
          Here's your system overview and quick actions
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8 w-full">
        {quickActions.map(action => (
          <Link key={action.path} href={action.path} className="w-full">
            <Button
              className={`
          w-full flex-1 min-w-0 py-4 sm:py-5 md:py-6 ${action.color}
          text-white font-medium flex items-center justify-center gap-2
          rounded-lg transition-all hover:shadow-lg
        `}
            >
              {action.icon}
              <span className="truncate">{action.label}</span>
            </Button>
          </Link>
        ))}
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-border p-4 md:p-6 hover:shadow-md transition-shadow"
          >
            {/* Icon & Label */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground font-medium">
                  {card.label}
                </p>
              </div>
              <div className={`${card.color} p-3 rounded-lg`}>{card.icon}</div>
            </div>

            {/* Value */}
            <div className="mb-3">
              <p className="text-3xl font-bold text-foreground">{card.value}</p>
            </div>

            {/* Trend */}
            {card.trend && (
              <p className="text-xs text-muted-foreground">{card.trend}</p>
            )}
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-lg border border-border p-6">
        <h2 className="text-xl font-bold text-foreground mb-4">
          Recent Tournaments
        </h2>

        {/* Placeholder Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                  Name
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                  Year
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                  Teams
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                  Managers
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  name: 'City League Championship',
                  year: 2024,
                  status: 'ongoing',
                  teams: 16,
                  managers: 2,
                },
                {
                  name: 'Regional Cup',
                  year: 2024,
                  status: 'scheduled',
                  teams: 12,
                  managers: 1,
                },
                {
                  name: 'Summer Tournament',
                  year: 2024,
                  status: 'finished',
                  teams: 20,
                  managers: 3,
                },
              ].map((tournament, idx) => (
                <tr
                  key={idx}
                  className="border-b border-border hover:bg-muted transition-colors"
                >
                  <td className="py-3 px-4 text-sm text-foreground font-medium">
                    {tournament.name}
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">
                    {tournament.year}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        tournament.status === 'ongoing'
                          ? 'status-ongoing'
                          : tournament.status === 'scheduled'
                          ? 'status-scheduled'
                          : 'status-finished'
                      }`}
                    >
                      {tournament.status.charAt(0).toUpperCase() +
                        tournament.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">
                    {tournament.teams}
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">
                    {tournament.managers}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* View All Link */}
        <div className="mt-4 text-center">
          <Link href="/admin/tournaments">
            {/* <Button variant="outline" size="sm" className="rounded-lg">
              View All Tournaments
            </Button> */}
          </Link>
        </div>
      </div>
    </Layout>
  );
}

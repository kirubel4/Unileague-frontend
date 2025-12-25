"use client";
import { Layout } from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  Search,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";

interface SystemLog {
  id: number;
  timestamp: string;
  type: "error" | "warning" | "info" | "success";
  category: "api" | "server" | "database" | "auth" | "tournament";
  message: string;
  analyzedMessage: string;
  details: string;
  severity: "critical" | "high" | "medium" | "low";
}

export default function AdminSystemLogs() {
  const userName = localStorage.getItem("userName") || "Admin";
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState<
    "all" | "critical" | "high" | "medium" | "low"
  >("all");
  const [typeFilter, setTypeFilter] = useState<
    "all" | "error" | "warning" | "info" | "success"
  >("all");
  const [selectedLog, setSelectedLog] = useState<SystemLog | null>(null);

  const logs: SystemLog[] = [
    {
      id: 1,
      timestamp: "Dec 19, 2024 14:32:45",
      type: "error",
      category: "database",
      message: "Database connection timeout on tournament queries",
      analyzedMessage:
        "The system encountered a database connection timeout while processing tournament data. This indicates potential database server performance issues or network connectivity problems. Maintenance team should check database server status and connection pooling settings.",
      details:
        "Connection pool exhausted after 30 seconds waiting for available connection",
      severity: "critical",
    },
    {
      id: 2,
      timestamp: "Dec 19, 2024 13:15:22",
      type: "warning",
      category: "api",
      message: "High API response time detected",
      analyzedMessage:
        "API endpoints are responding slower than expected (average response time: 2.5s). This could indicate server overload or inefficient database queries. Consider optimizing database queries or scaling server resources.",
      details:
        "Average response time exceeded threshold: 2500ms vs expected 500ms",
      severity: "high",
    },
    {
      id: 3,
      timestamp: "Dec 19, 2024 12:45:10",
      type: "error",
      category: "auth",
      message: "Multiple failed login attempts detected",
      analyzedMessage:
        "System detected 15 failed login attempts from IP 192.168.1.105 in 10 minutes. This could indicate a brute force attack attempt. Security team should review and potentially block this IP address.",
      details: "Failed attempts for users: admin, manager1, manager2",
      severity: "high",
    },
    {
      id: 4,
      timestamp: "Dec 19, 2024 11:20:33",
      type: "warning",
      category: "server",
      message: "Memory usage above 80%",
      analyzedMessage:
        "Server memory utilization reached 82%. Consider restarting services or investigating memory leaks in running processes. Monitor memory usage closely to prevent service disruptions.",
      details:
        "Current memory: 82% | Recommended action: Restart services or add more RAM",
      severity: "high",
    },
    {
      id: 5,
      timestamp: "Dec 19, 2024 10:05:44",
      type: "info",
      category: "tournament",
      message: "Tournament data backup completed",
      analyzedMessage:
        "Automatic backup of all tournament data completed successfully. All tournament records have been backed up to the secondary storage system.",
      details: "Backup size: 2.5GB | Duration: 3 minutes 22 seconds",
      severity: "low",
    },
    {
      id: 6,
      timestamp: "Dec 19, 2024 09:30:15",
      type: "error",
      category: "server",
      message: "Service restart due to memory leak",
      analyzedMessage:
        "The application service was automatically restarted due to detected memory leak. Memory consumption was growing uncontrollably. Investigation needed to identify and fix the source of the leak.",
      details:
        "Service: Tournament Manager API | Uptime before restart: 48 hours",
      severity: "critical",
    },
    {
      id: 7,
      timestamp: "Dec 19, 2024 08:45:20",
      type: "warning",
      category: "database",
      message: "Slow query detected",
      analyzedMessage:
        "A database query took longer than expected to execute (8.5 seconds). This query should be optimized with proper indexing. Database team should review and optimize this query.",
      details:
        "Query: SELECT * FROM tournaments JOIN managers... | Execution time: 8.5s",
      severity: "medium",
    },
    {
      id: 8,
      timestamp: "Dec 19, 2024 07:15:05",
      type: "success",
      category: "api",
      message: "System health check passed",
      analyzedMessage:
        "Automated system health check completed successfully. All critical components are functioning normally and within expected parameters.",
      details:
        "All checks passed: Database ✓ | API ✓ | Cache ✓ | Authentication ✓",
      severity: "low",
    },
  ];

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.analyzedMessage.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity =
      severityFilter === "all" || log.severity === severityFilter;
    const matchesType = typeFilter === "all" || log.type === typeFilter;
    return matchesSearch && matchesSeverity && matchesType;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-300";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case "warning":
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "info":
        return <Clock className="w-4 h-4 text-blue-600" />;
      default:
        return null;
    }
  };

  return (
    <Layout role="super_admin" userName={userName}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">System Logs</h1>
        <p className="text-muted-foreground mt-2">
          Monitor system errors, warnings, and events with AI analysis
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-border p-4 mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search logs by message or analysis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-lg h-9 pl-9 flex-1"
            />
          </div>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as any)}
            className="px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Types</option>
            <option value="error">Error</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
            <option value="success">Success</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto -mx-4 md:mx-0">
          <table className="w-full text-sm md:text-base">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="text-left py-2 md:py-3 px-2 md:px-4 font-semibold text-xs md:text-sm text-muted-foreground">
                  Timestamp
                </th>
                <th className="text-left py-2 md:py-3 px-2 md:px-4 font-semibold text-xs md:text-sm text-muted-foreground">
                  Type
                </th>
                <th className="text-left py-2 md:py-3 px-2 md:px-4 font-semibold text-xs md:text-sm text-muted-foreground hidden md:table-cell">
                  Category
                </th>
                <th className="text-left py-2 md:py-3 px-2 md:px-4 font-semibold text-xs md:text-sm text-muted-foreground">
                  Message
                </th>
                <th className="text-left py-2 md:py-3 px-2 md:px-4 font-semibold text-xs md:text-sm text-muted-foreground">
                  Severity
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="border-b border-border hover:bg-muted transition-colors cursor-pointer"
                    onClick={() => setSelectedLog(log)}
                  >
                    <td className="py-2 md:py-3 px-2 md:px-4 text-xs font-mono text-muted-foreground whitespace-nowrap">
                      {log.timestamp.split(" ")[0]}
                    </td>
                    <td className="py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm">
                      <div className="flex items-center gap-1 md:gap-2">
                        {getTypeIcon(log.type)}
                        <span className="capitalize hidden sm:inline">
                          {log.type}
                        </span>
                      </div>
                    </td>
                    <td className="py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm text-foreground capitalize hidden md:table-cell">
                      {log.category}
                    </td>
                    <td className="py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm text-foreground max-w-xs md:max-w-lg truncate">
                      {log.message}
                    </td>
                    <td className="py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(
                          log.severity
                        )}`}
                      >
                        {log.severity.charAt(0).toUpperCase() +
                          log.severity.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="py-8 px-4 text-center text-muted-foreground"
                  >
                    No logs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-2xl font-bold text-foreground">
                Log Details
              </h2>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-muted-foreground hover:text-foreground text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* Header Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Timestamp
                  </p>
                  <p className="font-medium text-foreground">
                    {selectedLog.timestamp}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Severity</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getSeverityColor(
                      selectedLog.severity
                    )}`}
                  >
                    {selectedLog.severity.charAt(0).toUpperCase() +
                      selectedLog.severity.slice(1)}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Type</p>
                  <div className="flex items-center gap-2">
                    {getTypeIcon(selectedLog.type)}
                    <span className="font-medium text-foreground capitalize">
                      {selectedLog.type}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Category</p>
                  <p className="font-medium text-foreground capitalize">
                    {selectedLog.category}
                  </p>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-xs text-muted-foreground mb-2">Message</p>
                <p className="font-medium text-foreground bg-muted p-3 rounded-lg">
                  {selectedLog.message}
                </p>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-xs text-muted-foreground mb-2">
                  AI Analysis
                </p>
                <p className="text-sm text-foreground bg-blue-50 p-4 rounded-lg border border-blue-200">
                  {selectedLog.analyzedMessage}
                </p>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-xs text-muted-foreground mb-2">
                  Technical Details
                </p>
                <p className="text-sm text-foreground bg-muted p-3 rounded-lg font-mono">
                  {selectedLog.details}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedLog(null)}
              className="w-full mt-6 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}

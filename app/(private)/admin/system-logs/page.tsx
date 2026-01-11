"use client";
import { Layout } from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Search,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Clock,
  X,
  Wrench,
  ExternalLink,
  Copy,
  Shield,
  Server,
  Database,
  Network,
  FileText,
  Bell,
  Send,
  Check,
} from "lucide-react";
import useSWR from "swr";
import { ApiResponse, fetcher, getCookie } from "@/lib/utils";
import { logMapper, SystemLogs } from "./util";
import { toast, Toaster } from "sonner";

interface MaintenanceRequest {
  priority: "low" | "medium" | "high" | "critical";
  description: string;
  assignToTeam: boolean;
  estimatedTime?: string;
  additionalNotes?: string;
}

export default function AdminSystemLogs() {
  const userName = getCookie("uName") || "Admin";
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState<
    "all" | "critical" | "serious" | "warning" | "error" | "info"
  >("all");
  const [selectedLog, setSelectedLog] = useState<SystemLogs | null>(null);
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);
  const [maintenanceRequest, setMaintenanceRequest] =
    useState<MaintenanceRequest>({
      priority: "medium",
      description: "",
      assignToTeam: true,
      estimatedTime: "2-4 hours",
      additionalNotes: "",
    });
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);

  const { data, isLoading, error, mutate } = useSWR(
    "/api/protected/admin/logs",
    fetcher,
    { revalidateOnFocus: false, refreshInterval: 30000 }
  );

  const log: SystemLogs[] = logMapper(data?.data?.data);

  const filteredLogs = log?.filter((log) => {
    const matchesSearch =
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.analyzedMessage.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity =
      severityFilter === "all" || log.severity === severityFilter;

    return matchesSearch && matchesSeverity;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-50 text-red-700 border-red-200";
      case "serious":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "error":
        return "bg-red-100 text-red-800 border-red-300";
      case "warning":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "info":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case "serious":
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case "info":
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "security":
        return <Shield className="w-4 h-4" />;
      case "database":
        return <Database className="w-4 h-4" />;
      case "server":
        return <Server className="w-4 h-4" />;
      case "network":
        return <Network className="w-4 h-4" />;
      case "application":
        return <FileText className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: MaintenanceRequest["priority"]) => {
    switch (priority) {
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

  const handleCopyDetails = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const handleSubmitMaintenanceRequest = async () => {
    if (!selectedLog) {
      toast.error("please select a log first");
      return;
    }
    setIsSubmittingRequest(true);
    try {
      const response = await fetch("/api/protected/admin/maintenance-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedLog.id,
        }),
      });
      const result: ApiResponse = await response.json();
      if (result.success) {
        toast.success("Maintenance request submitted successfully!");
        setShowMaintenanceForm(false);
        setMaintenanceRequest({
          priority: "medium",
          description: "",
          assignToTeam: true,
          estimatedTime: "2-4 hours",
          additionalNotes: "",
        });
      } else {
        toast.error(result.message || "Failed to submit request");
      }
    } catch (error) {
      toast.error("Error submitting maintenance request");
      console.error("Error:", error);
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Layout role="super_admin" userName={userName}>
      {/* Header */}
      <Toaster />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">System Logs</h1>
        <p className="text-muted-foreground mt-2">
          Monitor system health with AI-powered analysis and issue resolution
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-border p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search logs by message, analysis, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-lg h-10 pl-9 flex-1"
            />
          </div>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as any)}
            className="px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary h-10"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="serious">Serious</option>
            <option value="error">Error</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
          </select>
          <Button variant="outline" onClick={() => mutate()} className="h-10">
            Refresh
          </Button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-border">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-xs text-gray-600 uppercase tracking-wider">
                  Time
                </th>
                <th className="text-left py-3 px-4 font-semibold text-xs text-gray-600 uppercase tracking-wider">
                  Type
                </th>
                <th className="text-left py-3 px-4 font-semibold text-xs text-gray-600 uppercase tracking-wider">
                  Category
                </th>
                <th className="text-left py-3 px-4 font-semibold text-xs text-gray-600 uppercase tracking-wider">
                  Message
                </th>
                <th className="text-left py-3 px-4 font-semibold text-xs text-gray-600 uppercase tracking-wider">
                  Severity
                </th>
                <th className="text-left py-3 px-4 font-semibold text-xs text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 px-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-500">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                      Loading logs...
                    </div>
                  </td>
                </tr>
              ) : filteredLogs?.length > 0 ? (
                filteredLogs?.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4 text-xs font-mono text-gray-600 whitespace-nowrap">
                      {formatTimestamp(log.timestamp)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {getSeverityIcon(log.severity)}
                        <span className="capitalize text-sm">{log.type}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(log.category)}
                        <span className="text-sm text-gray-700 capitalize">
                          {log.category}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="max-w-md">
                        <p className="text-sm text-gray-900 line-clamp-2">
                          {log.message}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(
                          log.severity
                        )}`}
                      >
                        {getSeverityIcon(log.severity)}
                        {log.severity.charAt(0).toUpperCase() +
                          log.severity.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedLog(log)}
                        className="h-8 text-xs"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 px-4 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <Search className="w-12 h-12 text-gray-300" />
                      <p>No logs found matching your criteria</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSearchTerm("");
                          setSeverityFilter("all");
                        }}
                      >
                        Clear filters
                      </Button>
                    </div>
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
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-linear-to-r from-gray-50 to-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${getSeverityColor(
                      selectedLog.severity
                    )}`}
                  >
                    {getSeverityIcon(selectedLog.severity)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Log Analysis Details
                    </h2>
                    <p className="text-sm text-gray-600">
                      ID: {selectedLog.id} • {selectedLog.timestamp}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedLog(null);
                    setShowMaintenanceForm(false);
                  }}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <>
                {/* Log Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">Severity Level</p>
                    <div className="flex items-center gap-2">
                      {getSeverityIcon(selectedLog.severity)}
                      <span className="font-semibold text-gray-900 capitalize">
                        {selectedLog.severity}
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">Category</p>
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(selectedLog.category)}
                      <span className="font-semibold text-gray-900 capitalize">
                        {selectedLog.category}
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">Event Type</p>
                    <p className="font-semibold text-gray-900 capitalize">
                      {selectedLog.type}
                    </p>
                  </div>
                </div>

                {/* Original Message */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Original Error Message
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyDetails(selectedLog.message)}
                      className="h-8 text-xs"
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-700 font-mono text-sm whitespace-pre-wrap">
                      {selectedLog.message}
                    </p>
                  </div>
                </div>

                {/* AI Analysis */}

                {/* Technical Details */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Technical Details
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyDetails(selectedLog.details)}
                      className="h-8 text-xs"
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
                    <pre className="text-gray-300 text-sm font-mono whitespace-pre-wrap overflow-x-auto">
                      {selectedLog.details}
                    </pre>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200">
                  <Button
                    disabled={isSubmittingRequest}
                    onClick={() => handleSubmitMaintenanceRequest()}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Wrench className="w-4 h-4 mr-2" />
                    {isSubmittingRequest
                      ? "Requesting please wait"
                      : "Request Maintenance"}
                  </Button>
                </div>
              </>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

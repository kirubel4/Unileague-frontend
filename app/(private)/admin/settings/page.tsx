"use client";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Eye, EyeOff, Save, Bell, Lock, User, Shield } from "lucide-react";

export default function AdminSettings() {
  const userName = "Admin";
  const [activeTab, setActiveTab] = useState<
    "profile" | "security" | "notifications" | "system"
  >("profile");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [profileData, setProfileData] = useState({
    fullname: userName,
    email: "admin@example.com",
    phone: "+1 234 567 8900",
    position: "System Administrator",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    systemAlerts: true,
    tournamentUpdates: true,
    managerActions: true,
    userActivities: true,
    emailNotifications: true,
    smsNotifications: false,
  });

  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    enableUserRegistration: true,
    autoBackup: true,
    debugMode: false,
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (key: keyof typeof notificationSettings) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSystemChange = (key: keyof typeof systemSettings) => {
    setSystemSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    alert("Profile updated successfully!");
    setIsSaving(false);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      alert("Please fill in all password fields");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      alert("New password must be at least 8 characters");
      return;
    }

    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    alert("Password changed successfully!");
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setIsSaving(false);
  };

  const handleNotificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    alert("Notification settings updated successfully!");
    setIsSaving(false);
  };

  const handleSystemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    alert("System settings updated successfully!");
    setIsSaving(false);
  };

  return (
    <Layout role="super_admin" userName={userName}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account, security, and system preferences
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-border overflow-x-auto">
        {[
          { id: "profile", label: "Profile", icon: User },
          { id: "security", label: "Security", icon: Lock },
          { id: "notifications", label: "Notifications", icon: Bell },
          { id: "system", label: "System", icon: Shield },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="bg-white rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold mb-6 text-foreground">
            Profile Information
          </h3>
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <Label
                  htmlFor="fullname"
                  className="text-foreground font-semibold mb-2 block"
                >
                  Full Name
                </Label>
                <Input
                  id="fullname"
                  name="fullname"
                  type="text"
                  value={profileData.fullname}
                  onChange={handleProfileChange}
                  className="rounded-lg h-10"
                />
              </div>

              {/* Email */}
              <div>
                <Label
                  htmlFor="email"
                  className="text-foreground font-semibold mb-2 block"
                >
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  className="rounded-lg h-10"
                />
              </div>

              {/* Phone */}
              <div>
                <Label
                  htmlFor="phone"
                  className="text-foreground font-semibold mb-2 block"
                >
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                  className="rounded-lg h-10"
                />
              </div>

              {/* Position */}
              <div>
                <Label
                  htmlFor="position"
                  className="text-foreground font-semibold mb-2 block"
                >
                  Position
                </Label>
                <Input
                  id="position"
                  name="position"
                  type="text"
                  value={profileData.position}
                  onChange={handleProfileChange}
                  className="rounded-lg h-10"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-primary hover:bg-blue-600 text-white rounded-lg h-10 gap-2"
              >
                <Save className="w-4 h-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <div className="bg-white rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold mb-6 text-foreground">
            Change Password
          </h3>
          <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-md">
            {/* Current Password */}
            <div>
              <Label
                htmlFor="currentPassword"
                className="text-foreground font-semibold mb-2 block"
              >
                Current Password
              </Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter your current password"
                  className="rounded-lg h-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <Label
                htmlFor="newPassword"
                className="text-foreground font-semibold mb-2 block"
              >
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                  className="rounded-lg h-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Must be at least 8 characters long
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <Label
                htmlFor="confirmPassword"
                className="text-foreground font-semibold mb-2 block"
              >
                Confirm New Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                  className="rounded-lg h-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-primary hover:bg-blue-600 text-white rounded-lg h-10 gap-2"
              >
                <Lock className="w-4 h-4" />
                {isSaving ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <div className="bg-white rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold mb-6 text-foreground">
            Notification Preferences
          </h3>
          <form onSubmit={handleNotificationSubmit} className="space-y-6">
            {/* System Notifications */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">
                System Notifications
              </h4>
              <div className="space-y-3">
                {[
                  {
                    key: "systemAlerts" as const,
                    label: "System Alerts",
                    description: "Critical system alerts and errors",
                  },
                  {
                    key: "tournamentUpdates" as const,
                    label: "Tournament Updates",
                    description: "Updates on tournament activities",
                  },
                  {
                    key: "managerActions" as const,
                    label: "Manager Actions",
                    description: "Notifications on manager account activities",
                  },
                  {
                    key: "userActivities" as const,
                    label: "User Activities",
                    description: "Track user login and activities",
                  },
                ].map(({ key, label, description }) => (
                  <label
                    key={key}
                    className="flex items-start gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={notificationSettings[key]}
                      onChange={() => handleNotificationChange(key)}
                      className="mt-1 w-4 h-4 rounded border-border"
                    />
                    <div>
                      <p className="font-medium text-foreground">{label}</p>
                      <p className="text-xs text-muted-foreground">
                        {description}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Communication Channels */}
            <div className="pt-4 border-t border-border">
              <h4 className="font-semibold text-foreground mb-4">
                Communication Channels
              </h4>
              <div className="space-y-3">
                {[
                  {
                    key: "emailNotifications" as const,
                    label: "Email Notifications",
                    description: "Receive notifications via email",
                  },
                  {
                    key: "smsNotifications" as const,
                    label: "SMS Notifications",
                    description:
                      "Receive notifications via SMS (may incur charges)",
                  },
                ].map(({ key, label, description }) => (
                  <label
                    key={key}
                    className="flex items-start gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={notificationSettings[key]}
                      onChange={() => handleNotificationChange(key)}
                      className="mt-1 w-4 h-4 rounded border-border"
                    />
                    <div>
                      <p className="font-medium text-foreground">{label}</p>
                      <p className="text-xs text-muted-foreground">
                        {description}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-border">
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-primary hover:bg-blue-600 text-white rounded-lg h-10 gap-2"
              >
                <Bell className="w-4 h-4" />
                {isSaving ? "Saving..." : "Save Preferences"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* System Settings Tab */}
      {activeTab === "system" && (
        <div className="bg-white rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold mb-6 text-foreground">
            System Settings
          </h3>
          <form onSubmit={handleSystemSubmit} className="space-y-6">
            {/* System Configuration */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">
                System Configuration
              </h4>
              <div className="space-y-3">
                {[
                  {
                    key: "maintenanceMode" as const,
                    label: "Maintenance Mode",
                    description: "Take the system offline for maintenance",
                  },
                  {
                    key: "enableUserRegistration" as const,
                    label: "Enable User Registration",
                    description: "Allow new managers to register accounts",
                  },
                  {
                    key: "autoBackup" as const,
                    label: "Automatic Backups",
                    description: "Enable daily automatic system backups",
                  },
                  {
                    key: "debugMode" as const,
                    label: "Debug Mode",
                    description: "Enable debug logging for troubleshooting",
                  },
                ].map(({ key, label, description }) => (
                  <label
                    key={key}
                    className="flex items-start gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={systemSettings[key]}
                      onChange={() => handleSystemChange(key)}
                      className="mt-1 w-4 h-4 rounded border-border"
                    />
                    <div>
                      <p className="font-medium text-foreground">{label}</p>
                      <p className="text-xs text-muted-foreground">
                        {description}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-900">
                <span className="font-semibold">Caution:</span> Changes to
                system settings may affect all users. Please proceed with care.
              </p>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-border">
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-primary hover:bg-blue-600 text-white rounded-lg h-10 gap-2"
              >
                <Shield className="w-4 h-4" />
                {isSaving ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </Layout>
  );
}

'use client';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';
import { Eye, EyeOff, Save, Bell, Lock, User } from 'lucide-react';
import { ApiResponse, fetcher, getCookie } from '@/lib/utils';
import useSWR from 'swr';
import { toast, Toaster } from 'sonner';
export default function ManagerSettings() {
  const userName = getCookie('uName') || 'Admin';
  const [activeTab, setActiveTab] = useState<
    'profile' | 'security' | 'notifications'
  >('profile');
  const [initialProfileData, setInitialProfileData] = useState({
    username: '',
    fullName: '',
    email: '',
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [profileData, setProfileData] = useState({
    username: '',
    fullName: '',
    email: '',
  });
  const {
    data,
    isLoading,
    error,
    mutate: mutateMessage,
  } = useSWR('/api/protected/manager/user', fetcher, {
    revalidateOnFocus: false,
  });
  useEffect(() => {
    if (data?.data) {
      setProfileData({
        username: data?.data.username ?? '',
        fullName: data?.data.fullName ?? '',
        email: data?.data.email ?? '',
      });
    }
    setInitialProfileData({
      username: data?.data.username ?? '',
      fullName: data?.data.fullName ?? '',
      email: data?.data.email ?? '',
    });
  }, [data]);
  const hasProfileChanged =
    profileData.username !== initialProfileData.username ||
    profileData.fullName !== initialProfileData.fullName ||
    profileData.email !== initialProfileData.email;

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    matchNotifications: true,
    playerTransfers: true,
    teamUpdates: true,
    newsNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (key: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.loading('updating profile');
    setIsSaving(true);
    const res = await fetch('/api/protected/manager/user/update', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
    const response: ApiResponse = await res.json();
    if (!response.success) {
      toast.error(response.message || 'error updating profile');
      setIsSaving(false);
      return;
    }
    toast.success('profile updated');
    setIsSaving(false);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordData.currentPassword || !passwordData.newPassword) {
      toast.error('Please fill in all password fields');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }

    setIsSaving(true);

    try {
      const res = await fetch('/api/protected/manager/user/update/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data: ApiResponse = await res.json();

      if (res.ok && data.success) {
        toast.success(data.message || 'Password changed successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        toast.error(data.message || 'Failed to change password');
      }
    } catch (err) {
      console.error(err);
      toast.error('Internal server error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleNotificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    alert('Notification settings updated successfully!');
    setIsSaving(false);
  };

  return (
    <Layout role="super_admin" userName={userName}>
      {/* Header */}
      <div className="mb-8">
        <Toaster />
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account and preferences
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-border">
        {[
          { id: 'profile', label: 'Profile', icon: User },
          { id: 'security', label: 'Security', icon: Lock },
          { id: 'notifications', label: 'Notifications', icon: Bell },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
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
                  User Name
                </Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={profileData?.username}
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
                  value={profileData?.email}
                  onChange={handleProfileChange}
                  className="rounded-lg h-10"
                />
              </div>

              {/* Phone */}
              <div>
                <Label
                  htmlFor="fullName"
                  className="text-foreground font-semibold mb-2 block"
                >
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={profileData?.fullName}
                  onChange={handleProfileChange}
                  className="rounded-lg h-10"
                />
              </div>

              {/* Tournament */}
              <div>
                <Label
                  htmlFor="tournament"
                  className="text-foreground font-semibold mb-2 block"
                >
                  Actual Role
                </Label>
                <Input
                  id="tournament"
                  name="tournament"
                  type="text"
                  value={'Super Admin Mange the Whole System'}
                  onChange={handleProfileChange}
                  disabled
                  className="rounded-lg h-10 bg-muted cursor-not-allowed"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                type="submit"
                disabled={isSaving || !hasProfileChanged}
                className="bg-primary hover:bg-blue-600 text-white rounded-lg h-10 gap-2"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
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
                  type={showCurrentPassword ? 'text' : 'password'}
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
                  type={showNewPassword ? 'text' : 'password'}
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
                  type={showConfirmPassword ? 'text' : 'password'}
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
                {isSaving ? 'Updating...' : 'Update Password'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold mb-6 text-foreground">
            Notification Preferences
          </h3>
          <form onSubmit={handleNotificationSubmit} className="space-y-6">
            {/* In-App Notifications */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">
                In-App Notifications
              </h4>
              <div className="space-y-3">
                {[
                  {
                    key: 'matchNotifications' as const,
                    label: 'Match Notifications',
                    description:
                      'Get notified about match schedules and results',
                  },
                  {
                    key: 'playerTransfers' as const,
                    label: 'Player Transfers',
                    description: 'Receive updates on player transfers',
                  },
                  {
                    key: 'teamUpdates' as const,
                    label: 'Team Updates',
                    description:
                      'Get notified about team registration and changes',
                  },
                  {
                    key: 'newsNotifications' as const,
                    label: 'News & Announcements',
                    description: 'Receive tournament news and announcements',
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
                    key: 'emailNotifications' as const,
                    label: 'Email Notifications',
                    description: 'Receive notifications via email',
                  },
                  {
                    key: 'smsNotifications' as const,
                    label: 'SMS Notifications',
                    description:
                      'Receive notifications via SMS (may incur charges)',
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
                {isSaving ? 'Saving...' : 'Save Preferences'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </Layout>
  );
}

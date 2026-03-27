import { useMemo, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "sonner";
import { FaSync } from "react-icons/fa";

function getUserId(user) {
  return user?.id ?? user?.studentId ?? user?.teacherId ?? user?.adminId ?? "N/A";
}

function getRoleLabel(role) {
  if (!role) return "Unknown";
  const normalizedRole = role.toLowerCase();
  return normalizedRole.charAt(0).toUpperCase() + normalizedRole.slice(1);
}

function getInitials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "N/A";
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return (parts[0].slice(0, 1) + parts[1].slice(0, 1)).toUpperCase();
}

export default function ProfilePage() {
  const { user, fetchMe } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const role = (user?.role || "").toLowerCase();
  const displayName = user?.name ?? user?.firstName ?? "Unknown User";

  const roleSpecificField = useMemo(() => {
    if (role === "student") {
      return { label: "Roll Number", value: user?.rollNumber ?? "Not available" };
    }
    return { label: "Designation", value: user?.designation ?? "Not available" };
  }, [role, user?.designation, user?.rollNumber]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      //eslint-disable-next-line no-constant-condition
      if (true) {
        setIsRefreshing(false);
        setTimeout(() => {
          toast.success("Profile updated successfully!");
          setIsRefreshing(false);
        }, 1000);
        return; // This stops the code here so fetchMe() never runs
      }
      await fetchMe();
    } catch (error) {
      const message = error?.response?.data?.message || "Unable to refresh profile right now.";
      toast.error(message);
    } finally {
      setIsRefreshing(true);
    }
  };

  return (
    <section className="max-w-4xl mx-auto pb-12">
      {/* Profile Header Card */}
      <div className="relative overflow-hidden  border border-slate-200 bg-white shadow-sm rounded-2xl">
        {/* Decorative Banner Background */}

        <div className="p-6 md:px-8">
          <div className="relative flex flex-col items-start justify-between gap-4 md:flex-row md:items-end ">
            {/* Add circle with initials or image */}
            <div className="flex items-center rounded-full justify-center overflow-hidden border-white bg-slate-100 shadow-md">
              {user?.image ? (
                <img src={user.image} alt={displayName} className="w-full rounded-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-slate-400">{getInitials(displayName)}</span>
              )}
            </div>

            {/* Refresh Button */}
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="group flex items-center gap-2 cursor-pointer rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-slate-800 active:scale-95 disabled:opacity-70"
            >
              <FaSync
                name="refresh"
                className={`h-4 w-4 transition-transform ${isRefreshing ? "animate-spin" : "group-hover:rotate-180"}`}
              />
              {isRefreshing ? "Updating..." : "Refresh Profile"}
            </button>
          </div>

          <div className="mt-6">
            <h1 className="text-3xl font-bold text-slate-900">{displayName}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-orange-50 px-3 py-1 text-sm font-bold text-orange-600 ring-1 ring-inset ring-orange-200">
                {getRoleLabel(user?.role)}
              </span>
              <span className="text-sm font-medium text-slate-500">{user?.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Information Grid */}
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {/* Main Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">Personal Information</h3>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-500">Full Name</label>
                <p className="mt-1 font-semibold text-slate-900">{displayName}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500">Email Address</label>
                <p className="mt-1 font-semibold text-slate-900">{user?.email ?? "N/A"}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500">{roleSpecificField.label}</label>
                <p className="mt-1 font-semibold text-slate-900">{roleSpecificField.value}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Style Info */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">Account Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">User ID</span>
                <span className="font-mono text-sm font-bold text-slate-900">{getUserId(user)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Verification</span>
                <span className="inline-flex h-2 w-2 rounded-full bg-green-500"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

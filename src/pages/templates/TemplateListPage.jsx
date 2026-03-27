import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import { getTemplates } from "../../services/template.service";
import { useAuth } from "../../hooks/useAuth";

export default function TemplateListPage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const role = (user?.role || "").toLowerCase();
  const isAdmin = role === "admin";

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const data = await getTemplates();
        setTemplates(Array.isArray(data) ? data : data?.templates || []);
        setError(null);
      } catch (err) {
        console.error("Template fetch error:", err);
        const errorMsg = err.response?.data?.message || err.message || "Failed to load templates";
        setError(errorMsg);
        setTemplates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Templates</h1>
        <div className="rounded-lg border border-gray-100 bg-white p-6 text-gray-500">Loading templates...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Templates</h1>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Templates</h1>
        <span className="text-sm text-gray-500">{templates.length} total</span>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        {templates.length === 0 ? (
          <div className="p-6 text-sm text-gray-500">No templates available.</div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {templates.map((template) => (
              <li key={template.templateId} className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">{template.name}</p>
                  <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {template.totalDuration || 0} hrs
                    </span>
                  </div>
                </div>
                <Link
                  to={`/user/templates/${template.templateId}`}
                  className="rounded-md border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                  View
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

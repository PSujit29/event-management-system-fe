import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Clock, ChevronLeft } from "lucide-react";
import { getTemplateById } from "../../services/template.service";
import { useAuth } from "../../hooks/useAuth";

export default function TemplateDetailPage() {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const role = (user?.role || "").toLowerCase();
  const isAdmin = role === "admin";

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        setLoading(true);
        const data = await getTemplateById(templateId);
        setTemplate(data);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to load template");
        setTemplate(null);
      } finally {
        setLoading(false);
      }
    };

    if (templateId) {
      fetchTemplate();
    }
  }, [templateId]);

  if (loading) {
    return (
      <div className="space-y-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>
        <div className="rounded-lg border border-gray-100 bg-white p-6 text-gray-500">Loading template...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="space-y-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-600">Template not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
        <ChevronLeft className="h-4 w-4" />
        Back
      </button>

      <div className="rounded-xl border border-gray-100 bg-white shadow-sm p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{template.name}</h1>
            <p className="mt-2 text-sm text-gray-600">{template.description || "No description"}</p>
            <div className="mt-4 flex items-center gap-3 text-sm text-gray-500">
              <span className="inline-flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Total Duration: {template.totalDuration || 0} hrs
              </span>
            </div>
          </div>
          {isAdmin && (
            <Link
              to={`/user/templates/${templateId}/clone`}
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              Clone Template
            </Link>
          )}
        </div>
      </div>

      {template.subEvents && template.subEvents.length > 0 && (
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Sub-Events</h2>
          <ul className="space-y-3">
            {template.subEvents.map((subEvent, idx) => (
              <li key={idx} className="rounded-lg border border-gray-200 p-3">
                <p className="text-sm font-medium text-gray-900">{subEvent.name}</p>
                <p className="mt-1 text-xs text-gray-600">{subEvent.description || "No description"}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

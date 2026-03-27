import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaRegClock, FaArrowRightLong, FaRegClone, FaLayerGroup } from "react-icons/fa6";
import { getTemplates } from "../../services/template.service";

export default function TemplateListPage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      <div className="space-y-4 rounded-2xl bg-slate-100 p-5 md:p-6">
        <h1 className="text-2xl font-bold text-slate-900">Templates</h1>
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">Loading templates...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 rounded-2xl bg-slate-100 p-5 md:p-6">
        <h1 className="text-2xl font-bold text-slate-900">Templates</h1>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 rounded-2xl bg-slate-100 p-5 md:p-6">
      {/* Header Section */}
      <div className="flex items-end justify-between border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Event Templates</h1>
          <p className="mt-1 text-sm text-slate-600">Select a pre-defined structure to start your event.</p>
        </div>
        <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 transition-transform duration-200 hover:scale-95">
          {templates.length} Available
        </span>
      </div>

      {templates.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white py-20 text-center shadow-sm">
          <FaRegClone className="h-12 w-12 text-slate-400" />
          <p className="mt-4 text-slate-600">No templates available at the moment.</p>
        </div>
      ) : (
        /* The Card Grid */
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 cursor-pointer">
          {templates.map((template) => (
            <div
              key={template.templateId}
              className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:border-amber-300 hover:shadow-xl"
            >
              <div>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700 transition-all duration-300 group-hover:scale-95 group-hover:bg-amber-500 group-hover:text-white">
                  <FaRegClone className="h-5 w-5" />
                </div>

                <h3 className="text-lg font-bold text-slate-900 transition-colors duration-300 group-hover:text-slate-950">
                  {template.name}
                </h3>

                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">
                  {template.description || "No description provided for this template."}
                </p>

                <div className="mt-4 flex items-center gap-4 border-t border-slate-200 pt-4">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                    <FaRegClock className="h-4 w-4 text-slate-500" />
                    {template.totalDuration || 0} Hours
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                    <FaLayerGroup className="h-4 w-4 text-amber-600" />
                    {template.subEvents?.length || 0} Sessions
                  </div>
                </div>
              </div>

              <Link
                to={`/user/templates/${template.templateId}`}
                className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-95 hover:bg-amber-500 hover:text-slate-950 active:scale-95"
              >
                Use Template
                <FaArrowRightLong className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

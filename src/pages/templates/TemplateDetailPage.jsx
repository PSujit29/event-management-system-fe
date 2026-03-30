import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaArrowLeftLong, FaRegClock, FaArrowRightLong } from "react-icons/fa6";
import {HiTemplate} from "react-icons/hi";
import {MdEventNote} from "react-icons/md";

import { getTemplateById } from "../../services/template.service";
import { useAuth } from "../../hooks/useAuth";
import { formatDurationHours } from "../../utils/date.utils";

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
      <div className="space-y-4 rounded-2xl bg-slate-100 p-5 md:p-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm font-medium text-slate-600 transition-all hover:scale-95 hover:text-slate-900"
        >
          <FaArrowLeftLong className="h-4 w-4" />
          Back
        </button>
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">Loading template...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 rounded-2xl bg-slate-100 p-5 md:p-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm font-medium text-slate-600 transition-all hover:scale-95 hover:text-slate-900"
        >
          <FaArrowLeftLong className="h-4 w-4" />
          Back
        </button>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="space-y-4 rounded-2xl bg-slate-100 p-5 md:p-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm font-medium text-slate-600 transition-all hover:scale-95 hover:text-slate-900"
        >
          <FaArrowLeftLong className="h-4 w-4" />
          Back
        </button>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">Template not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 rounded-2xl bg-slate-100 p-5 md:p-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm font-medium text-slate-600 transition-all hover:scale-95 hover:text-slate-900"
      >
        <FaArrowLeftLong className="h-4 w-4" />
        Back
      </button>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
              <HiTemplate className="h-3.5 w-3.5" />
              Template Overview
            </div>
            <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">{template.name}</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 md:text-base">{template.description || "No description"}</p>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-700">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 font-semibold">
                <FaRegClock className="h-4 w-4 text-slate-500" />
                Total Duration: {formatDurationHours(template.totalDuration)}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 font-semibold text-amber-700">
                <MdEventNote className="h-4 w-4" />
                {template.subEvents?.length || 0} Sessions
              </span>
            </div>
          </div>
          {isAdmin && (
            <Link
              to={`/user/templates/${templateId}/clone`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-95 hover:bg-amber-500 hover:text-slate-950 active:scale-95"
            >
              Clone Template
              <FaArrowRightLong className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>

      {template.subEvents && template.subEvents.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
          <h2 className="mb-1 text-lg font-semibold text-slate-900 md:text-xl">Event Flow</h2>
          <p className="mb-5 text-sm text-slate-600">Structured sequence of sessions included in this template.</p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {template.subEvents.map((subEvent, idx) => (
              <div
                key={idx}
                className="group rounded-xl border border-slate-200 bg-linear-to-b from-white to-slate-50 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.01] hover:border-amber-300 hover:shadow-md"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white transition-all duration-300 group-hover:bg-amber-500 group-hover:text-slate-950">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Session</span>
                </div>
                <p className="text-sm font-semibold text-slate-900">{subEvent.name}</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{subEvent.description || "No description"}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

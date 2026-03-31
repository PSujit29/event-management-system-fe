import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cloneTemplateToEvent, getTemplateById } from "../../services/template.service";
import { LabeledDateInput, LabeledInput, LabeledTextArea } from "../../components/form/input";
import { parseApiError } from "../../utils/error.utils";

const TIME_INPUT_REGEX = /^\d{2}:\d{2}$/;

function isValidTimeInput(value) {
  if (!TIME_INPUT_REGEX.test(value)) return false;
  const [hours, minutes] = value.split(":").map(Number);
  return hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60;
}

const cloneTemplateSchema = z.object({
  name: z.string().trim().min(1, "Event Name is required"),
  description: z.string().trim().optional(),
  startDate: z.string().trim().min(1, "Start Date is required"),
  startTime: z.string().trim().min(1, "Event Time is required").refine(isValidTimeInput, "Event Time must be in HH:MM format"),
});

export default function CloneTemplatePage() {
  const { templateId } = useParams();
  const navigate = useNavigate();

  const [templateName, setTemplateName] = useState("");
  const [error, setError] = useState("");
  const [clonedEventSummary, setClonedEventSummary] = useState(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { name: "", description: "", startDate: "", startTime: "" }, resolver: zodResolver(cloneTemplateSchema) });

  useEffect(() => {
    async function fetchTemplateInfo() {
      try {
        const template = await getTemplateById(templateId);
        if (template) setTemplateName(template.name);
      } catch (err) {
        setError(parseApiError(err, "Failed to load template details."));
      }
    }

    if (templateId) fetchTemplateInfo();
  }, [templateId]);

  const submitForm = async (data) => {
    setError("");

    try {
      const newEvent = await cloneTemplateToEvent(templateId, data);
      setClonedEventSummary(newEvent);

      setTimeout(() => {
        navigate(`/user/events/${newEvent.eventId}`);
      }, 3000);
    } catch (err) {
      setError(parseApiError(err, "An error occurred while cloning the template."));
    }
  };

  if (clonedEventSummary) {
    return (
      <div className="w-full bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-6">
        <div className="max-w-xl w-full bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Generated!</h2>
            <p className="text-gray-500 mb-6">Redirecting you to the event dashboard...</p>
          </div>

          <div className="bg-gray-50 rounded-lg border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 text-lg">{clonedEventSummary.name}</h3>
            <p className="text-sm text-gray-600 mt-1">
              Starts: <span className="font-medium text-gray-900">{clonedEventSummary.startDate}</span>
            </p>

            <div className="mt-5">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Auto-generated Sub-events</h4>
              <ul className="space-y-3">
                {(clonedEventSummary.subEvents || []).map((sub) => (
                  <li
                    key={sub.subEventId ?? sub.id}
                    className="text-sm flex flex-col sm:flex-row sm:justify-between border-b border-gray-200 pb-2 last:border-0 last:pb-0"
                  >
                    <div>
                      <span className="block font-medium text-gray-800">{sub.name}</span>
                      <span className="block text-xs text-gray-500">{sub.description}</span>
                    </div>
                    <span className="mt-1 sm:mt-0 text-indigo-600 font-medium">{sub.startDate ?? sub.date}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 py-6 px-2 sm:px-4 lg:px-8 flex justify-center">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Create Event from Template</h1>
          {templateName && (
            <span className="inline-block mt-2 px-3 py-1 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-full">
              Template: {templateName}
            </span>
          )}
          <p className="mt-4 text-sm text-gray-500">
            Fill in the details below. We will use the template structure to automatically generate your event and schedule all required
            sub-sessions.
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(submitForm)} className="space-y-6">
          <fieldset disabled={isSubmitting} className="space-y-6 border-none p-0 m-0">
            <LabeledInput
              type="text"
              label="Event Name"
              name="name"
              handler={control}
              errMsg={errors?.name?.message}
              placeholder="e.g., Q3 Engineering Workshop"
            />

            <LabeledTextArea
              label="Description"
              name="description"
              handler={control}
              errMsg={errors?.description?.message}
              placeholder="Provide context or a brief overview for the attendees..."
            />

            <LabeledDateInput label="Start Date" name="startDate" handler={control} errMsg={errors?.startDate?.message} />

            <LabeledInput type="time" label="Event Time" name="startTime" handler={control} errMsg={errors?.startTime?.message} />
          </fieldset>

          <div className="pt-6 flex flex-col-reverse gap-3 border-t border-gray-200 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full rounded-md border border-gray-300 bg-white py-2 px-5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors sm:w-auto"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Generating...
                </span>
              ) : (
                "Clone Template"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

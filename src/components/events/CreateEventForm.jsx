import { LabeledInput, LabeledDateInput, LabeledTextArea } from "../form/input";
import { Button } from "../form/button";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { createEvent as createEventApi } from "../../services/event.service";
import { useFieldArray } from "react-hook-form";

const DATE_INPUT_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function isValidDateInput(value) {
  if (!DATE_INPUT_REGEX.test(value)) return false;

  const [year, month, day] = value.split("-").map(Number);
  const parsedDate = new Date(value + "T00:00:00");

  return (
    !Number.isNaN(parsedDate.getTime()) &&
    parsedDate.getFullYear() === year &&
    parsedDate.getMonth() + 1 === month &&
    parsedDate.getDate() === day
  );
}

function isTodayOrFuture(value) {
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const target = new Date(value + "T00:00:00");
  return target >= todayStart;
}

const createEventSchema = z
  .object({
    name: z.string().trim().min(1, "Event Name is required"),
    description: z.string().trim().min(1, "Event Description is required"),
    startDate: z
      .string()
      .trim()
      .min(1, "Start Date is required")
      .refine((value) => DATE_INPUT_REGEX.test(value), "Start Date must be in YYYY-MM-DD format")
      .refine(isValidDateInput, "Start Date is not a valid calendar date")
      .refine(isTodayOrFuture, "Start Date cannot be in the past"),
    duration: z.coerce.number().positive("Duration must be at least 1 hour"),
    subEvents: z.array(
      z.object({
        name: z.string().trim().min(1, "Sub-Event Name is required"),
        duration: z.coerce.number().positive("Sub-Event Duration must be at least 1 hour"),
        description: z.string().trim().min(1, "Sub-Event Description is required"),
      }),
    ),
  })
  .refine(
    (data) => {
      const totalSubDuration = data.subEvents.reduce((sum, sub) => sum + sub.duration, 0);
      return totalSubDuration <= data.duration;
    },
    { message: "Main Event duration must be >= the total duration of sub-events", path: ["duration"] },
  );

export default function CreateEventForm() {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { name: "", description: "", startDate: "", duration: 1, subEvents: [] },
    resolver: zodResolver(createEventSchema),
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({ control, name: "subEvents" });

  const submitForm = async (data) => {
    if (isSubmitting) return;

    const { ...payload } = data;

    //BUG: This is purely bad but since i dont have backend this is the relaible way, thanks.
    try {
      const event = await createEventApi(payload);
      const existingEvents = JSON.parse(localStorage.getItem("all_events") || "[]");
      existingEvents.push(event);
      localStorage.setItem("all_events", JSON.stringify(existingEvents));
      toast.success("Event created successfully!");
      navigate("/user/events/" + event.eventId);
    } catch (err) {
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to create event.";
      toast.error(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitForm)} className="flex flex-col gap-5">
      <fieldset disabled={isSubmitting} className="flex flex-col gap-5 border-none p-0 m-0">
        <LabeledInput type="text" label="Name" name="name" handler={control} errMsg={errors?.name?.message} />
        <LabeledTextArea type="textarea" label="Description" name="description" handler={control} errMsg={errors?.description?.message} />
        <LabeledDateInput label="Start Date" name="startDate" handler={control} errMsg={errors?.startDate?.message} />
        <LabeledInput type="number" label="Duration (hours)" name="duration" handler={control} errMsg={errors?.duration?.message} />
        {/* Sub-Events Section */}
        <div className="mt-8 border-t border-gray-200 pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Sub-Events</h3>
            <button
              type="button"
              className="cursor-pointer px-4 py-2 text-sm font-medium text-orange-600 border border-orange-600 rounded-md hover:bg-orange-50 transition-colors"
              onClick={() => append({ name: "", duration: "", description: "" })}
            >
              + Add Sub-Event
            </button>
          </div>

          <div className="space-y-3">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="p-5 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-500">Sub-Event {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="cursor-pointer mt-1 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
                    aria-label="Remove sub-event"
                  >
                    <svg xmlns="http://www.w3.org" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div>
                  <div className="flex flex-col gap-5 border-none p-0 m-0">
                    {/* Row 1: Name takes more space, Duration is smaller */}
                    <LabeledInput
                      label="Name"
                      name={`subEvents.${index}.name`}
                      handler={control}
                      errMsg={errors?.subEvents?.[index]?.name?.message}
                    />

                    <LabeledInput
                      type="number"
                      label="Duration"
                      name={`subEvents.${index}.duration`}
                      handler={control}
                      errMsg={errors?.subEvents?.[index]?.duration?.message}
                    />

                    {/* Row 2: Full width Description */}
                    <LabeledTextArea
                      label="Description"
                      name={`subEvents.${index}.description`}
                      handler={control}
                      errMsg={errors?.subEvents?.[index]?.description?.message}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            ))}

            {fields.length === 0 && (
              <p className="text-center py-6 text-sm text-gray-400 italic border-2 border-dashed border-gray-100 rounded-lg">
                No sub-events added yet.
              </p>
            )}
          </div>
        </div>
      </fieldset>

      <div className="flex w-full gap-3 mt-4">
        <Button type="reset" variant="danger" txt="Cancel" disabled={isSubmitting} />

        <Button type="submit" txt={isSubmitting ? "Creating Event..." : "Create Event"} disabled={isSubmitting} />
      </div>
    </form>
  );
}

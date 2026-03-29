import { LabeledInput, LabeledDateInput, LabeledTextArea } from "../form/input";
import { Button } from "../form/button";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useEffect } from "react";

// Reuse your existing validation logic
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

const editEventSchema = z
  .object({
    name: z.string().trim().min(1, "Event Name is required"),
    description: z.string().trim().min(1, "Event Description is required"),
    startDate: z
      .string()
      .trim()
      .min(1, "Start Date is required")
      .refine(isValidDateInput, "Invalid date format")
      .refine(isTodayOrFuture, "Date cannot be in the past"),

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
    { message: `Total sub-event hours cannot exceed the main event's ${data.duration} hours`, path: ["duration"] },
  );

export default function EditEventForm({ eventData }) {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: eventData, resolver: zodResolver(editEventSchema), mode: "onChange" });

  const { fields, append, remove } = useFieldArray({ control, name: "subEvents" });

  useEffect(() => {
    if (eventData) reset(eventData);
  }, [eventData, reset]);

  const submitForm = async (data) => {
    try {
      const existingEvents = JSON.parse(localStorage.getItem("all_events") || "[]");

      const updatedEvents = existingEvents.map((ev) => (ev.eventId === eventData.eventId ? { ...ev, ...data } : ev));

      localStorage.setItem("all_events", JSON.stringify(updatedEvents));

      toast.success("Event updated successfully!");
      navigate("/user/events/" + eventData.eventId);
    } catch (err) {
      toast.error("Failed to update event." + (err?.message || ""));
    }
  };

  return (
    <form onSubmit={handleSubmit(submitForm)} className="flex flex-col gap-5">
      <fieldset disabled={isSubmitting} className="flex flex-col gap-5 border-none p-0 m-0">
        <LabeledInput label="Name" name="name" handler={control} errMsg={errors?.name?.message} />
        <LabeledTextArea label="Description" name="description" handler={control} errMsg={errors?.description?.message} />
        <LabeledDateInput label="Start Date" name="startDate" handler={control} errMsg={errors?.startDate?.message} />
        <LabeledInput type="number" label="Duration (hours)" name="duration" handler={control} errMsg={errors?.duration?.message} />

        <div className="mt-8 border-t border-gray-200 pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Sub-Events</h3>
            <button
              type="button"
              className="cursor-pointer px-4 py-2 text-sm font-medium text-orange-600 border border-orange-600 rounded-md hover:bg-orange-50"
              onClick={() => append({ name: "", duration: 1, description: "" })}
            >
              + Add Sub-Event
            </button>
          </div>

          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="p-5 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-500">Sub-Event {index + 1}</span>
                  <button type="button" onClick={() => remove(index)} className="text-gray-400 hover:text-red-500">
                    Remove
                  </button>
                </div>
                <div className="flex flex-col gap-5">
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
                  <LabeledTextArea
                    label="Description"
                    name={`subEvents.${index}.description`}
                    handler={control}
                    errMsg={errors?.subEvents?.[index]?.description?.message}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </fieldset>

      <div className="flex w-full gap-3 mt-4">
        <Button type="button" variant="danger" txt="Cancel" onClick={() => navigate(-1)} />
        <Button type="submit" txt={isSubmitting ? "Saving..." : "Save Changes"} disabled={isSubmitting} />
      </div>
    </form>
  );
}

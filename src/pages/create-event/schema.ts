import * as z from "zod";
import { TEXT } from "@/constants/text";

export const createEventSchema = z
  .object({
    name: z.string().min(1, TEXT.createEvent.form.fields.nameLabel),
    location: z.string().optional().default(""),
    eventDate: z.string().min(1, TEXT.createEvent.toast.missingDateTime),
    startTime: z.string().min(1, TEXT.createEvent.toast.missingDateTime),
    endTime: z.string().min(1, TEXT.createEvent.toast.missingEndTime),
    linkedinUrl: z.string().url().or(z.literal("")).optional().default(""),
  })
  .refine(
    (data) => {
      if (!data.eventDate || !data.startTime || !data.endTime) return true;
      const start = new Date(`${data.eventDate}T${data.startTime}`);
      const end = new Date(`${data.eventDate}T${data.endTime}`);
      return end > start;
    },
    {
      message: TEXT.createEvent.toast.invalidTimeRange,
      path: ["endTime"],
    },
  );

export type CreateEventValues = z.infer<typeof createEventSchema>;

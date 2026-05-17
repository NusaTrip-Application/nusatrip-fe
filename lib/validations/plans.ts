import { z } from "zod";

export const planSchema = z.object({
  title: z.string().min(3, "Nama perjalanan minimal 3 karakter"),
  destination: z.string().min(3, "Tujuan wajib diisi"),
  startDate: z.string().min(1, "Tanggal mulai wajib diisi"),
  endDate: z.string().min(1, "Tanggal selesai wajib diisi"),
  travelers: z.string().min(1, "Jumlah wisatawan wajib diisi"),
  interests: z.array(z.string()).min(1, "Pilih minimal 1 minat perjalanan"),
  budget: z.string().min(1, "Estimasi anggaran wajib diisi"),
});

export type PlanFormValues = z.infer<typeof planSchema>;
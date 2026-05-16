import { z } from "zod";

// Skema Validasi Login
export const loginSchema = z.object({
  email: z.string().min(1, "Alamat email wajib diisi").email("Format email tidak valid"),
  password: z.string().min(8, "Kata sandi minimal 8 karakter"),
  remember: z.boolean().optional(),
});

// Skema Validasi Register
export const registerSchema = z.object({
  fullName: z.string().min(3, "Nama lengkap minimal 3 karakter"),
  email: z.string().min(1, "Alamat email wajib diisi").email("Format email tidak valid"),
  password: z.string().min(8, "Kata sandi minimal 8 karakter"),
  confirmPassword: z.string().min(1, "Konfirmasi kata sandi wajib diisi"),
  terms: z.boolean().refine((val) => val === true, {
    message: "Anda harus menyetujui Syarat & Ketentuan",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Kata sandi tidak cocok",
  path: ["confirmPassword"],
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
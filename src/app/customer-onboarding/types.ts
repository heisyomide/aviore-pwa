import * as z from "zod";

export const step1CustomerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z
    .string()
    .min(10, "Please enter a valid phone number")
    .regex(/^\+?[0-9\s\-()]+$/, "Phone number contains invalid characters"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const step2CustomerSchema = z.object({
  agreeToTerms: z.literal(true, {
    message: "You must agree to the Terms of Service" ,
  }),
  agreeToPrivacy: z.literal(true, {
   message: "You must agree to the Privacy Policy" ,
  }),
});

export type Step1CustomerData = z.infer<typeof step1CustomerSchema>;
export type Step2CustomerData = z.infer<typeof step2CustomerSchema>;

export interface CustomerRegistrationPayload extends Omit<Step1CustomerData, "confirmPassword"> {
  agreeToTerms: boolean;
  agreeToPrivacy: boolean;
}
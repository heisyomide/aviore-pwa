import * as z from "zod";

export enum UserRole {
  CUSTOMER = "CUSTOMER",
  RIDER = "RIDER",
  ORGANIZER = "ORGANIZER",
  BUSINESS_OWNER = "BUSINESS_OWNER",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export enum AccountStatus {
  ACTIVE = "ACTIVE",
  UNDER_REVIEW = "UNDER_REVIEW",
  REJECTED = "REJECTED",
  PENDING = "PENDING",
  PENDING_VERIFICATION = "PENDING_VERIFICATION",
}

// 1. Shared Base Customer / Initial Personal Details
export const customerSignUpSchema = z.object({
  name: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Please provide a valid email address"),
  phone: z.string().regex(/^[0-9]{11}$/, "Phone number must be exactly 11 digits (e.g. 08012345678)"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  address: z.string().min(5, "Full address details are required"),
});

// 2. Rider Step 2 Details
export const riderVehicleSchema = z.object({
  vehicleType: z.string().min(1, "Please select your operational vehicle classification"),
  license: z.string().min(4, "Driver or rider license identifier string is required"),
});

// 3. Rider Step 3 Details
export const riderBankSchema = z.object({
  bankName: z.string().min(2, "Bank choice selection is required"),
  accountNumber: z.string().regex(/^[0-9]{10}$/, "Account number must be exactly 10 digits"),
  accountName: z.string().min(3, "Settlement bank account recipient name is required"),
  acceptTerms: z.literal(true, {
    message: "You must accept the terms to proceed",
  }),
});

// Combined Final Post Object for Rider registration
export const fullRiderSignUpSchema = customerSignUpSchema
  .merge(riderVehicleSchema)
  .merge(riderBankSchema);

export type CustomerSignUpData = z.infer<typeof customerSignUpSchema>;
export type FullRiderSignUpData = z.infer<typeof fullRiderSignUpSchema>;
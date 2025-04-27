import { z } from "zod";
import { AgencyStatus } from "@prisma/client";

export const agencySchema = z.object({
  fantasyName: z.string().min(1, "Fantasy name is required"),
  legalName: z.string().min(1, "Legal name is required"),
  cnpj: z.string().min(1, "CNPJ is required"),
  stateRegistration: z.string().min(1, "State registration is required"),
  foundingDate: z.string().refine((date) => {
    try {
      // Validate that the string can be parsed as a valid date
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime());
    } catch {
      return false;
    }
  }, "Invalid date format. Please use YYYY-MM-DD format"),
  status: z.enum([
    AgencyStatus.ACTIVE,
    AgencyStatus.INACTIVE,
    AgencyStatus.PENDING,
    AgencyStatus.SUSPENDED,
  ]),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  website: z.string().optional(),
  description: z.string().optional(),
});

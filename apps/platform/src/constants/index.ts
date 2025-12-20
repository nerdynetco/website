import { z } from "zod";
import { orgConfig } from "~/project.config";
import { formatNumberOrdinal } from "~/utils/number";

// Simplified role system for builder community
// Old system had 13 roles (warden, librarian, guard, etc.) which were for traditional institutional management
// New system has 4 roles focused on builder community needs
export const ROLES_ENUMS = {
  ADMIN: "admin",           // Platform administrators
  BUILDER: "builder",       // Student builders (formerly STUDENT)
  MENTOR: "mentor",         // Faculty/mentors (formerly FACULTY)
  MODERATOR: "moderator",   // Community/house moderators
} as const;

export const ROLES: readonly string[] = Object.values(ROLES_ENUMS);

export const ROLES_MAP = Object.fromEntries(
  Object.entries(ROLES).map(([key, value]) => [value, key])
);

export const ALLOWED_ROLES = [
  ROLES_ENUMS.ADMIN,
  ROLES_ENUMS.BUILDER,
  ROLES_ENUMS.MENTOR,
  ROLES_ENUMS.MODERATOR,
  "dashboard"
];

export const GENDER = {
  MALE: "male",
  FEMALE: "female",
  NOT_SPECIFIED: "not_specified",
};
export const GENDER_ENUMS = Object.values(GENDER);
export const genderSchema = z.enum(["male", "female", "not_specified"]);

export const emailSchema = z
  .string()
  .email({ message: "Invalid email address" })
  .max(100, { message: "Email cannot exceed 100 characters" })
  // .refine((val) => val.endsWith(`@${orgConfig.domain}`), {
  //   message: `Email must end with @${orgConfig.domain}`,
  // });

export const rollNoSchema = z
  .string()
//   .regex(/^\d{2}[a-z]{3}\d{3}$/i)
//   .refine(
//     (rollNo) => {
//       const numericPart = Number.parseInt(rollNo.slice(-3));
//       return numericPart >= 1 && numericPart <= 999;
//     },
//     {
//       message: "Invalid roll number",
//     }
//   );
// export const isValidRollNumber = (rollNo: string): boolean => {
//   return rollNoSchema.safeParse(rollNo).success;
// };

const passwordSettings = {
  minLength: 8,
  minUppercase: 1,
  minLowercase: 1,
  minNumbers: 1,
  minSpecialChars: 1,
  specialChars: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/,
  uppercaseRegex: /[A-Z]/g,
  lowercaseRegex: /[a-z]/g,
  numbersRegex: /[0-9]/g,
};

export const passwordSchema = z
  .string()
  .min(passwordSettings.minLength)
  .refine(
    (password) =>
      (password.match(passwordSettings.uppercaseRegex) || []).length >=
      passwordSettings.minUppercase,
    {
      message: `Password must contain at least ${passwordSettings.minUppercase} uppercase letter`,
    }
  )
  .refine(
    (password) =>
      (password.match(passwordSettings.lowercaseRegex) || []).length >=
      passwordSettings.minLowercase,
    {
      message: `Password must contain at least ${passwordSettings.minLowercase} lowercase letter`,
    }
  )
  .refine(
    (password) =>
      (password.match(passwordSettings.numbersRegex) || []).length >=
      passwordSettings.minNumbers,
    {
      message: `Password must contain at least ${passwordSettings.minNumbers} number`,
    }
  )
  .refine(
    (password) =>
      passwordSettings.specialChars.test(password) &&
      (password.match(passwordSettings.specialChars) || []).length >=
        passwordSettings.minSpecialChars,
    {
      message: `Password must contain at least ${passwordSettings.minSpecialChars} special character`,
    }
  );

// Programme/batch management removed - not needed for builder community
// Builders can optionally specify graduation year in their profile
// No need for complex roll number parsing or programme tracking

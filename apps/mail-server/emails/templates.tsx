import {WelcomeVerifyEmail} from "./template_welcome-verify";
import {ResetPasswordEmail} from "./template_reset-password";


export const emailTemplates = {
    "welcome_verify": WelcomeVerifyEmail,
    "reset-password": ResetPasswordEmail,
} as const;
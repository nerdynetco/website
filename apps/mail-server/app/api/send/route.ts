import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { render } from "@react-email/components";

import { getEmailTemplate } from "@/emails";
import { handleEmailFire } from "@/emails/helper";
import {SENDER,IDENTITY_KEY} from "@/project.config";


const payloadSchema = z.object({
  template_key: z.string(),
  targets: z.array(z.string().email()),
  subject: z.string(),
  payload: z.record(
    z.union([z.string(), z.number(), z.array(z.string()), z.array(z.number())])
  ),
});

export async function POST(request: NextRequest) {
  try {

    const body = await request.json();

    const res = payloadSchema.safeParse(body);
    if (!res.success) {
      return NextResponse.json(
        {
          error: res.error,
          data: null,
        },
        { status: 400 }
      );
    }
    const { template_key, targets, subject, payload } = res.data;
    // save this in logger database
    console.log("Sending email to", targets);
    console.log("Subject", subject);
    console.log("Template", template_key);
    console.log("Payload", payload);
    const EmailTemplate = getEmailTemplate({ template_key, payload });

    if(!EmailTemplate) {
      return NextResponse.json(
        {
          error: "Invalid template key",
          data: null,
        },
        { status: 400 }
      );
    }

    const emailHtml = await render(EmailTemplate);
    const response = await handleEmailFire(
      SENDER,
      {
        to: targets,
        subject: subject,
        html: emailHtml,
      }
    );
    console.log("Email sent", response);
    if (response.rejected.length > 0) {
      return NextResponse.json(
        { error: response.rejected, data: null },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { data: response.accepted, error: null },
      { status: 200 }
    );
  } catch (error) {
    return Response.json({ error, data: null }, { status: 500 });
  }
}

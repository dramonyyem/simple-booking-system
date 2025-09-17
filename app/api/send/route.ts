import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

function generateHtmlTable(data: Record<string, any>) {
  const rows = Object.entries(data)
    .map(
      ([key, value], index) => `
        <tr style="background-color: ${index % 2 === 0 ? "#f9f9f9" : "#ffffff"};">
          <td style="padding: 12px 16px; border: 1px solid #ddd; font-weight: bold;">${key}</td>
          <td style="padding: 12px 16px; border: 1px solid #ddd;">${value}</td>
        </tr>
      `,
    )
    .join("");

  return `
    <table style="border-collapse: collapse; width: 80%; max-width: 700px; text-align: left; font-size: 16px; font-family: Arial, sans-serif; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
      ${rows}
    </table>
  `;
}

function generateEmailHtml(data: Record<string, any>) {
  return `
    <div style="width: 100%; font-family: Arial, sans-serif; background-color: #f2f2f2; display: flex; flex-direction: column; min-height: 100vh; padding: 0; margin: 0;">
      
      <div style="width: 100%; background-color: purple; color: white; text-align: center; padding: 20px 0; font-size: 24px; font-weight: bold;">
        My Project Name
      </div>

      <div style="flex: 1; display: flex; justify-content: center; align-items: center; margin: 20px 0;">
        ${generateHtmlTable(data)}
      </div>

      <div style="width: 100%; text-align: center; color: #888; font-size: 14px; padding: 20px 0; background-color: #f2f2f2;">
        &copy; ${new Date().getFullYear()} My Project Name. All rights reserved.
      </div>
    </div>
  `;
}

export async function POST(req: NextRequest) {
  try {
    const { to, subject, text, html, data } = (await req.json()) as {
      to: string;
      subject: string;
      text?: string;
      html?: string;
      data?: Record<string, any>;
    };

    if (!to || !subject || (!text && !html && !data)) {
      return NextResponse.json(
        {
          success: false,
          error: "Must provide 'to', 'subject', and 'text', 'html', or 'data'",
        },
        { status: 400 },
      );
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 587,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });

    const emailHtml = html || (data ? generateEmailHtml(data) : undefined);
    const emailText =
      text || (data ? JSON.stringify(data, null, 2) : undefined);

    const info = await transporter.sendMail({
      from: '"Simple Booking System" <hello@example.com>',
      to,
      subject,
      text: emailText,
      html: emailHtml,
    });

    return NextResponse.json({ success: true, info });
  } catch (err: any) {
    console.error("SMTP Mailtrap error:", err);

    return NextResponse.json(
      { success: false, error: err.message || err },
      { status: 500 },
    );
  }
}

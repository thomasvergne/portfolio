import type { APIRoute } from "astro";
import nodemailer from "nodemailer";

export const POST: APIRoute = async ({ request, redirect, url }) => {
  const body = await request.formData();

  // Extracting form data
  const name = body.get("name")?.toString();
  const email = body.get("email")?.toString();
  const message = body.get("message")?.toString();
  const subject = body.get("subject")?.toString();
  const lang = body.get("lang")?.toString();

  // Validate form data
  if (!name || !email || !message || !subject || !lang) {
    url.searchParams.set("error", "missingData");
    url.pathname = `/${lang}/contact`;
    return redirect(url.toString());
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    url.searchParams.set('error', 'invalidEmail');
    url.pathname = `/${lang}/contact`;

    return redirect(url.toString()); 
  }

  // Send email using nodemailer
  const transporter = nodemailer.createTransport({
    host: import.meta.env.EMAIL_HOST,
    port: Number(import.meta.env.EMAIL_PORT),
    secure: true,
    auth: {
      user: import.meta.env.EMAIL_USERNAME,
      pass: import.meta.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: email,
    to: import.meta.env.EMAIL_USERNAME,
    subject: subject,
    text: message,
  };

  await transporter.sendMail(mailOptions);

  return redirect(`/${lang}/contact?success=true`);
};
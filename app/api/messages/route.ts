import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Message from "@/lib/models/Message";
import nodemailer from "nodemailer";

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_TO = process.env.EMAIL_TO || EMAIL_USER;

async function sendMail({ to, subject, html }: { to: string; subject: string; html: string }) {
  if (!EMAIL_USER || !EMAIL_PASS) throw new Error("Email credentials not set");
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });
  return transporter.sendMail({
    from: `Derem Rivera | Web Portfolio <${EMAIL_USER}>`,
    to,
    subject,
    html,
  });
}

// --- Rate Limiting ---
const rateLimitMap = new Map<string, number[]>(); // IP -> array of timestamps
const RATE_LIMIT_WINDOW = 10 * 60 * 1000; // 10 minutes in ms
const RATE_LIMIT_COUNT = 3; // max 3 messages per window

function getClientIp(req: Request) {
  return req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "unknown";
}

export async function GET() {
  await dbConnect();
  const messages = await Message.find();
  return NextResponse.json(messages);
}

export async function POST(request: Request) {
  // Rate limiting logic
  const ip = getClientIp(request);
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  // Remove timestamps older than window
  const recent = timestamps.filter((ts) => now - ts < RATE_LIMIT_WINDOW);
  if (recent.length >= RATE_LIMIT_COUNT) {
    return NextResponse.json(
      { message: `Too many requests. Please wait before sending more messages (max 3 every 10 minutes).` },
      { status: 429 }
    );
  }
  recent.push(now);
  rateLimitMap.set(ip, recent);

  await dbConnect();
  const data = await request.json();
  // Map 'message' to 'content' for model compatibility
  const { name, email, message, subject, ...rest } = data;
  if (!name || !email || !message) {
    return NextResponse.json({ message: "Name, email, and message are required." }, { status: 400 });
  }
  const messageDoc = await Message.create({
    name,
    email,
    content: message, // Map to required field
    ...rest,
  });

  // --- Email to site owner ---
  const ownerHtml = `
    <div style="background:#0a0f29;padding:32px 24px;border-radius:16px;color:#fff;font-family:sans-serif;max-width:600px;margin:auto;">
      <h2 style="color:#FFD600;margin-bottom:8px;">New Portfolio Message</h2>
      <div style="margin-bottom:16px;">
        <strong style="color:#FFD600;">From:</strong> <span>${name} (${email})</span><br/>
        <strong style="color:#FFD600;">Subject:</strong> <span>${subject || "No subject"}</span>
      </div>
      <div style="background:#181d3a;padding:16px 20px;border-radius:8px;color:#FFD600;font-size:1.1em;">
        ${message.replace(/\n/g, "<br/>")}
      </div>
      <div style="margin-top:24px;font-size:0.95em;color:#fff;">This message was sent from your portfolio contact form.</div>
    </div>
  `;
  await sendMail({
    to: EMAIL_TO!,
    subject: `Derem Rivera | Portfolio ${subject || "No subject"}`,
    html: ownerHtml,
  });

  // --- Auto-reply to sender ---
  const replyHtml = `
    <div style="background:#0a0f29;padding:32px 24px;border-radius:16px;color:#fff;font-family:sans-serif;max-width:600px;margin:auto;">
      <h2 style="color:#FFD600;margin-bottom:8px;">Thank you for reaching out!</h2>
      <p style="color:#fff;margin-bottom:16px;">Hi <strong style="color:#FFD600;">${name}</strong>,</p>
      <p style="color:#fff;margin-bottom:16px;">I appreciate your message and will get back to you as soon as possible.<br/>In the meantime, feel free to explore more of my work on my portfolio.</p>
      <div style="background:#181d3a;padding:16px 20px;border-radius:8px;color:#FFD600;font-size:1.1em;margin-bottom:16px;">
        <strong>Your message:</strong><br/>
        ${message.replace(/\n/g, "<br/>")}
      </div>
      <p style="color:#FFD600;margin-top:24px;">Talk soon!<br/>Derem</p>
      <div style="margin-top:24px;font-size:0.95em;color:#fff;">This is an automated response to confirm we received your message.</div>
    </div>
  `;
  await sendMail({
    to: email,
    subject: `Thank you for contacting`,
    html: replyHtml,
  });

  return NextResponse.json(messageDoc, { status: 201 });
}

export async function PUT(request: Request) {
  await dbConnect();
  const { id, ...update } = await request.json();
  const updated = await Message.findByIdAndUpdate(id, update, { new: true });
  if (!updated) {
    return NextResponse.json({ message: "Message not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(request: Request) {
  await dbConnect();
  const { id } = await request.json();
  const deleted = await Message.findByIdAndDelete(id);
  if (!deleted) {
    return NextResponse.json({ message: "Message not found" }, { status: 404 });
  }
  return NextResponse.json({ message: "Message deleted successfully" });
}

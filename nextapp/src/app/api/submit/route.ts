import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // server only
);

export async function POST(req: NextRequest) {
  try {
    const { number } = await req.json();

    if (!number || number < 1 || number > 100) {
      return NextResponse.json(
        { error: "Invalid number" },
        { status: 400 }
      );
    }

    // 🌐 Get user IP
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : "unknown";

    // 🔐 Hash IP
    const ipHash = crypto
      .createHash("sha256")
      .update(ip)
      .digest("hex");

    // 🚫 Try insert (unique index will block duplicates)
    const { error } = await supabase.from("guesses").insert({
      number,
      ip_hash: ipHash,
    });

    if (error) {
      return NextResponse.json(
        { error: "Nice try 😏 one brain = one vote" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
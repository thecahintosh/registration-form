import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

/* ================= TYPES ================= */

interface RegistrationBody {
  type: "individual" | "team";
  name: string;
  roll: string;
  email: string;
  phone: string;
  // Frontend sends these as comma-separated strings
  memberNames?: string;
  memberRolls?: string;
  memberPhones?: string;
}

/* ================= HANDLER ================= */

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RegistrationBody;

    /* ---------- Basic validation ---------- */
    if (!body.type || !body.name || !body.roll || !body.email || !body.phone) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    /* ---------- Team validation (MIN 2, MAX 5) ---------- */
    if (body.type === "team") {
      const memberCount = body.memberNames
        ? body.memberNames.split(",").filter((n) => n.trim()).length
        : 0;

      if (memberCount < 2 || memberCount > 5) {
        return NextResponse.json(
          {
            success: false,
            error: "Team must have between 2 and 5 members",
          },
          { status: 400 }
        );
      }
    }

    /* ---------- Env validation ---------- */
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;
    const sheetId = process.env.GOOGLE_SHEET_ID;

    if (!clientEmail || !privateKey || !sheetId) {
      throw new Error("Missing Google API environment variables");
    }

    /* ---------- Google Auth ---------- */
    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    /* ---------- Format member data (replace commas with pipes for consistency) ---------- */
    const memberNames = body.memberNames
      ? body.memberNames.split(",").map((n) => n.trim()).join(" | ")
      : "";

    const memberRolls = body.memberRolls
      ? body.memberRolls.split(",").map((r) => r.trim()).join(" | ")
      : "";

    const memberPhones = body.memberPhones
      ? body.memberPhones.split(",").map((p) => p.trim()).join(" | ")
      : "";

    /* ---------- Append to Sheet ---------- */
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "Sheet1!A:H",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            body.type,      // Type
            body.name,      // Name (Individual / Team Leader)
            body.roll,      // Roll No
            body.email,     // Email
            body.phone,     // Phone
            memberNames,    // Member Names
            memberRolls,    // Member Roll Numbers
            memberPhones,   // Member Phone Numbers
          ],
        ],
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    console.error("Registration Error:", errorMessage);

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

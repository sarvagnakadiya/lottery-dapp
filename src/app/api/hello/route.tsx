// src/app/api/hello/route.ts (using TypeScript)

import { NextRequest, NextResponse } from "next/server";
import { details } from "../../types/details";

// POST request handler
export async function POST(request: NextRequest) {
  console.log("Received a POST request");

  try {
    const data = (await request.json()) as details;
    console.log("Request data:", data);

    // Validate the data if necessary
    if (!data.name || !data.email || typeof data.age !== "number") {
      throw new Error("Invalid input");
    }

    return NextResponse.json({
      message: "Template: POST request received",
      data,
    });
  } catch (error) {
    console.error("Error parsing request body:", error);
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }
}

// GET request handler
export async function GET(request: NextRequest) {
  console.log("Received a GET request");

  return NextResponse.json({ message: "template: this is a GET request done" });
}

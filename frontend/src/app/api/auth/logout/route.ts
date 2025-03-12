import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const cookiesList = await cookies();
  cookiesList.delete("accessToken");
  return NextResponse.json({
    message: "User logged out successfully",
    status: 201,
  });
}

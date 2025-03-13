import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookiesList = await cookies();
  cookiesList.delete("accessToken");
  return NextResponse.json({
    message: "User logged out successfully",
    status: 201,
  });
}

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(req: Request) {
  if (!API_URL) {
    return NextResponse.json(
      { message: "API_URL is not defined" },
      { status: 500 }
    );
  }

  const { address } = await req.json();

  if (!address) {
    return NextResponse.json(
      { error: "Wallet address is required" },
      { status: 400 }
    );
  }

  const url = `${API_URL}/campaign/token/${address}`;

  try {
    const response = await axios.get(url);

    const token = response.data.token;

    const cookieStore = await cookies();

    cookieStore.set("accessToken", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
      path: "/",
    });

    return NextResponse.json({ status: response.data.status });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: `Failed to authenticate: ${error.message}` },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: "Failed to authenticate" },
        { status: 500 }
      );
    }
  }
}

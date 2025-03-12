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

  const { id } = await req.json();

  const url = `${API_URL}/campaign/${id}`;

  try {
    const response = await axios.get(url);

    const { data, status } = response;

    return NextResponse.json(data, { status });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message = error.response?.data?.message || error.message;

      console.log("error", error.response?.data?.message);

      return NextResponse.json(
        { message: `Request failed: ${message}` },
        { status }
      );
    }

    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

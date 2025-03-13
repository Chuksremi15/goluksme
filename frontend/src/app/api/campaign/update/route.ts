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

  const cookiesList = await cookies();
  const accessToken = cookiesList.get("accessToken");
  if (!accessToken?.value) {
    return NextResponse.json(
      { message: "User is not authenticated" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();

    const { formData, dataId } = body;

    const url = `${API_URL}/campaign/update/${dataId}`;

    const response = await axios.put(url, formData, {
      headers: { Authorization: `Bearer ${accessToken.value}` },
    });

    const { data, status } = response;

    return NextResponse.json(data, { status });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message = error.response?.data?.message || error.message;

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

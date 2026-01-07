import { ApiResponse } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const mid = request.cookies.get("mid")?.value;
    if (!mid) {
      return NextResponse.json(
        { message: "Missing parameters" },
        { status: 500 }
      );
    }
    const formData = await request.formData();

    const content = formData.get("content");

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { message: "Missing or invalid content" },
        { status: 400 }
      );
    }

    // 1. Parse JSON properly
    let parsedContent: any;

    try {
      parsedContent = JSON.parse(content);
    } catch {
      return NextResponse.json(
        { message: "Invalid JSON in content" },
        { status: 400 }
      );
    }
    parsedContent.adminId = mid;
    formData.set("content", JSON.stringify(parsedContent));

    console.log(formData);
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backend) {
      return NextResponse.json(
        { message: "Missing NEXT_PUBLIC_BACKEND_URL" },
        { status: 500 }
      );
    }
    const res = await fetch(`${backend}/admin/news/create`, {
      method: "POST",
      body: formData,
    });
    const data: ApiResponse = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Proxy create error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: String(error) },
      { status: 500 }
    );
  }
}

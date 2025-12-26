import { clsx, type ClassValue } from "clsx";
import { NextResponse } from "next/server";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export interface ApiResponse<T = any, G = any> {
  success?: boolean;
  statusCode: number;
  message: string;
  data?: T;
  meta?: G;
}
export async function forwardApiResponse(res: Response) {
  const data: ApiResponse = await res.json();
  return NextResponse.json(data, { status: data.statusCode });
}
export async function fetcher(url: string, options?: RequestInit) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout
  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeout);
    const data = await res.json();
    if (!res.ok) {
      const message = data?.message || "Something went wrong";
      throw new Error(message);
    }
    return data;
  } catch (error: any) {
    if (error.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }
    throw new Error(error.message || "Unexpected error occurred");
  }
}
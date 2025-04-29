import { NextRequest, NextResponse } from "next/server";
import {
  deleteItemCallback,
  updateQuantityCallback,
  handleCartItemOperation,
} from "@/utils/api/cart";

export const dynamic = "force-dynamic";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
): Promise<NextResponse> {
  return handleCartItemOperation(request, params, updateQuantityCallback);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
): Promise<NextResponse> {
  return handleCartItemOperation(request, params, deleteItemCallback);
}

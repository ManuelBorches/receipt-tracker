"use server";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import convex from "@/lib/convexClient";

// Server action to get a download URL for a file in Convex storage
export async function getFileDownloadUrl(fileId: Id<"_storage"> | string) {
  try {
    // Get a temporary download URL for the file
    const downloadUrl = await convex.query(api.receipts.getReceiptDownloadUrl, {
      fileId: fileId as Id<"_storage">,
    });

    if (!downloadUrl) {
      throw new Error("Failed to generate download URL");
    }

    return {
      success: true,
      downloadUrl,
    };
  } catch (error) {
    console.error("Error getting file download URL:", error);
    return { success: false, error: "Failed to get file download URL" };
  }
}

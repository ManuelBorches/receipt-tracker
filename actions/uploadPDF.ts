"use server";

import { api } from "@/convex/_generated/api";
import convex from "@/lib/convexClient";
import { currentUser } from "@clerk/nextjs/server";
import { getFileDownloadUrl } from "./getFileDownloadUrl";
import { inngest } from "@/inngest/client";
import Events from "@/inngest/constants";

// Server action to upload a PDF file to Convex storage

export async function uploadPDF(formData: FormData) {
  const user = await currentUser();

  if (!user) {
    return { success: false, error: "User not found" };
  }

  try {
    // Get the file from the form data
    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, error: "File not found" };
    }

    // Validate the file type
    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      return {
        success: false,
        error: "Invalid file type. Only PDF are allowed",
      };
    }

    // Get upload URL from Convex storage
    const uploadUrl = await convex.mutation(api.receipts.generateUploadUrl, {});

    // Convert file to array buffer for upload fetch API
    const arrayBuffer = await file.arrayBuffer();

    // Upload the file to Convex storage
    const uploadResponse = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        "Content-Type": file.type,
      },
      body: new Uint8Array(arrayBuffer),
    });

    if (!uploadResponse.ok) {
      throw new Error(`Failed to upload file: ${uploadResponse.statusText}`);
    }

    // Get storage ID from the upload response
    const { storageId } = await uploadResponse.json();

    // Add receipt to the database
    const receiptId = await convex.mutation(api.receipts.storeReceipt, {
      userId: user.id,
      fileId: storageId,
      fileName: file.name,
      size: file.size,
      mimeType: file.type,
    });

    // Generate the file URL
    const fileUrl = await getFileDownloadUrl(storageId);

    // Trigger inngest agent flow...
    await inngest.send({
      name: Events.EXTRACT_DATA_FROM_PDF_AND_SAVE_TO_DATABASE,
      data: {
        url: fileUrl.downloadUrl,
        receiptId,
      },
    });

    return {
      success: true,
      data: {
        receiptId,
        fileName: file.name,
      },
    };
  } catch (error) {
    console.error("Server action upload file error:", error);
    return { success: false, error: "Error uploading file" };
  }
}

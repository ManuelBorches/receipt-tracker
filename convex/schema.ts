import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// The schema is entirely optional.
// You can delete this file (schema.ts) and the
// app will continue to work.
// The schema provides more precise TypeScript types.
export default defineSchema({
  receipts: defineTable({
    userId: v.string(), // Clerk user ID
    fileName: v.string(), // Name of the uploaded file
    fileDisplayName: v.string(), // Display name of the uploaded file
    fileId: v.id("_storage"), // ID of the file in Convex storage
    // uploadedAt: v.date(), // Date when the file was uploaded
    uploadedAt: v.number(), // Date when the file was uploaded
    size: v.number(), // Size of the uploaded file in bytes
    mimeType: v.string(), // MIME type of the uploaded file
    status: v.string(), // "pending", "processed", "error" // Status of the file processing

    // Fields for extracted data
    merchantName: v.optional(v.string()), // Name of the merchant
    merchantAddress: v.optional(v.string()), // Address of the merchant
    merchantContact: v.optional(v.string()), // Contact information of the merchant
    transactionDate: v.optional(v.string()), // Date of the transaction
    transactionAmount: v.optional(v.string()), // Amount of the transaction
    currency: v.optional(v.string()), // Currency of the transaction
    receiptSummary: v.optional(v.string()), // Summary of the receipt
    items: v.array(
      v.object({
        name: v.string(), // Name of the item
        quantity: v.number(), // Quantity of the item
        unitPrice: v.number(), // Price of the item
        totalPrice: v.number(), // Total price of the item
      }),
    ),
  }),
});

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Function to generate a Convex upload URL for the client
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    // Generate a URL that the client use to upload the file
    return await ctx.storage.generateUploadUrl();
  },
});

// Store a receipt file and add it to the database
export const storeReceipt = mutation({
  args: {
    userId: v.string(), // Clerk user ID
    fileId: v.id("_storage"), // ID of the file in Convex storage
    fileName: v.string(), // Name of the uploaded file
    size: v.number(), // Size of the uploaded file in bytes
    mimeType: v.string(), // MIME type of the uploaded file
  },
  handler: async (ctx, args) => {
    // Save the receipt to the database
    const receiptId = await ctx.db.insert("receipts", {
      userId: args.userId,
      fileId: args.fileId,
      fileName: args.fileName,
      size: args.size,
      mimeType: args.mimeType,
      uploadedAt: Date.now(),
      status: "pending", // Initial status
      // Initialize extracted data fields as undefined
      merchantName: undefined,
      merchantAddress: undefined,
      merchantContact: undefined,
      transactionDate: undefined,
      transactionAmount: undefined,
      currency: undefined,
      fileDisplayName: args.fileName, // Add fileDisplayName property
      items: [],
    });

    return receiptId;
  },
});

// Function to get all receipts for a user
export const getReceipts = query({
  args: {
    userId: v.string(), // Clerk user ID
  },
  handler: async (ctx, args) => {
    // Only return receipts for the authenticated user
    return await ctx.db
      .query("receipts")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .order("desc")
      .collect();
  },
});

// Function to get a single receipt by ID
export const getReceiptById = query({
  args: {
    id: v.id("receipts"), // ID of the receipt
  },
  handler: async (ctx, args) => {
    // Get the receipt by ID
    const receipt = await ctx.db.get(args.id);

    // Verify user has access to the receipt
    if (receipt) {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) {
        throw new Error("User not authenticated");
      }

      const userId = identity.subject;
      if (receipt.userId !== userId) {
        console.log("DEBUGGGG");
        console.log("receipt.userId", receipt.userId);
        console.log("userId", userId);
        throw new Error("Not authorized to access this receipt");
      }
    }
    return receipt;
  },
});

// Generate a download URL for a receipt file
export const getReceiptDownloadUrl = query({
  args: {
    fileId: v.id("_storage"), // ID of the file in Convex storage
  },
  handler: async (ctx, args) => {
    // Get a temporary download URL for the file
    return await ctx.storage.getUrl(args.fileId);
  },
});

// Function to update the status of a receipt
export const updateReceiptStatus = mutation({
  args: {
    id: v.id("receipts"), // ID of the receipt
    status: v.string(), // New status of the receipt
  },
  handler: async (ctx, args) => {
    // Verify the user has access to the receipt
    const receipt = await ctx.db.get(args.id);
    if (!receipt) {
      throw new Error("Receipt not found");
    }
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("User not authenticated");
    }
    const userId = identity.userId;
    if (receipt.userId !== userId) {
      throw new Error("Not authorized to update this receipt");
    }
    // Update the status of the receipt
    await ctx.db.patch(args.id, {
      status: args.status,
    });
    return true;
  },
});

// Delete a receipt and its associated file
export const deleteReceipt = mutation({
  args: {
    id: v.id("receipts"), // ID of the receipt
  },
  handler: async (ctx, args) => {
    const receipt = await ctx.db.get(args.id);
    if (!receipt) {
      throw new Error("Receipt not found");
    }

    // Verify the user has access to the receipt
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("User not authenticated");
    }

    const userId = identity.subject;
    if (receipt.userId !== userId) {
      throw new Error("Not authorized to delete this receipt");
    }

    // Delete the file from Convex storage
    await ctx.storage.delete(receipt.fileId);

    // Delete the receipt from the database
    await ctx.db.delete(args.id);

    return true;
  },
});

// Function to update a receipt with extracted data
export const updateReceiptWithExtractedData = mutation({
  args: {
    id: v.id("receipts"), // ID of the receipt
    fileDisplayName: v.string(),
    merchantName: v.optional(v.string()),
    merchantAddress: v.optional(v.string()),
    merchantContact: v.optional(v.string()),
    transactionDate: v.optional(v.string()),
    transactionAmount: v.optional(v.string()),
    currency: v.optional(v.string()),
    receiptSummary: v.optional(v.string()),
    items: v.array(
      v.object({
        name: v.string(),
        quantity: v.number(),
        unitPrice: v.number(),
        totalPrice: v.number(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    // Verify the receipt exists
    const receipt = await ctx.db.get(args.id);
    if (!receipt) {
      throw new Error("Receipt not found");
    }

    // Update the receipt with extracted data
    await ctx.db.patch(args.id, {
      fileDisplayName: args.fileDisplayName,
      merchantName: args.merchantName,
      merchantAddress: args.merchantAddress,
      merchantContact: args.merchantContact,
      transactionDate: args.transactionDate,
      transactionAmount: args.transactionAmount,
      currency: args.currency,
      receiptSummary: args.receiptSummary,
      items: args.items,
      status: "processed", // Update status to processed once data is extracted
    });

    return {
      userId: receipt.userId,
    };
  },
});

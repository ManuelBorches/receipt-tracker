import { createAgent, createTool } from "@inngest/agent-kit";
import { anthropic, openai } from "inngest";
import { z } from "zod";

const parsePdfTool = createTool({
  name: "parse-pdf",
  // description: "Parses the given PDF file and extracts text from it.",
  description: "Analyzes the given PDF.",
  parameters: z.object({
    pdfUrl: z.string().describe("The URL of the PDF file to parse."),
  }),
  handler: async (params, context) => {
    const { pdfUrl } = params;
    const { step } = context;

    try {
      return await step?.ai.infer("parse-pdf", {
        model: anthropic({
          model: "claude-3-5-sonnet-20241022",
          defaultParameters: {
            max_tokens: 3094,
          },
        }),

        body: {
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "document",
                  source: {
                    type: "url",
                    url: pdfUrl,
                  },
                },
                {
                  type: "text",
                  text: `Extract the key data from this PDF. Once the data is extracted, return the structured output as follows:
                            {
                                "merchant": {
                                    "name": "Store Number",
                                    "address": "123 Main St, City, Country",
                                    "contact": "+123456789"
                                },
                                "tramsaction": {
                                    "date": "2023-10-01",
                                    "time": "12:00 PM",
                                    "receipt_number": "ABC123456",
                                    "payment_method": "Credit Card"
                                },
                                "items": [
                                    {
                                        "name": "Item 1",
                                        "quantity": 2,
                                        "unit_price": 10.00,
                                        "total_price": 20.00
                                    }
                                ],
                                "totals": {
                                    "subtotal": 20.00,
                                    "taxes": 2.00,
                                    "total": 22.00,
                                    "currency": "USD"
                                },
                            }
                            `,
                },
              ],
            },
          ],
        },
      });
    } catch (error) {
      console.error("Error parsing PDF:", error);
      throw new Error("Failed to parse PDF");
    }
  },
});

export const receiptScanningAgent = createAgent({
  name: "Receipt Scanning Agent",
  description:
    "Processes receipt images and PDFs to extract key information such as vendor names, dates, amounts, and line items.",
  system: `You are an AI-powered receipt scanning assistant. Your primary role is to accurately extract and structure relevant information from scanned receipts. Your task includes recognizing and parsing details such as:
    • Merchant Information: Store name, address, contact details
    • Transaction Details: Date, time, receipt number, payment method
    • Itemized Purchases: Product names, quantities, individual prices, discounts
    • Total Amounts: Subtotal, taxes, total paid, and any applied discounts
    • Ensure high accuracy by detecting OCR errors and correcting misread text when possible.
    • Normalize dates, currency values, and formatting for consistency.
    • If any key details are missing or unclear, return a structured response indicating incomplete data. 
    • Handle multiple formats, languages, and varying receipt layouts efficiently.
    • Maintain a structured JSON output for easy integration with databases or expense tracking systems.`,
  model: openai({
    model: "gpt-4o-mini",
    defaultParameters: {
      max_completion_tokens: 3094,
    },
  }),
  tools: [parsePdfTool],
});

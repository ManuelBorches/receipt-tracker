import {
  anthropic,
  createNetwork,
  getDefaultRoutingAgent,
} from "@inngest/agent-kit";
import { createServer } from "@inngest/agent-kit/server";
import Events from "./constants";
import { inngest } from "./client";
import { databaseAgent } from "./agents/databaseAgent";
import { receiptScanningAgent } from "./agents/receiptScanningAgent";

const agentNetwork = createNetwork({
  name: "Agent Team",
  agents: [databaseAgent, receiptScanningAgent],
  defaultModel: anthropic({
    model: "claude-3-5-sonnet-latest",
    defaultParameters: {
      max_tokens: 1000,
    },
  }),
  defaultRouter: ({ network }) => {
    const savedToDatabase = network.state.kv.get("saved-to-database");

    if (savedToDatabase !== undefined) {
      // Terminate the agent process if the data has been saved to the database
      return undefined;
    }
    return getDefaultRoutingAgent();
  },
});

export const server = createServer({
  agents: [databaseAgent, receiptScanningAgent],
  networks: [agentNetwork],
});

export const extractAndSavePDF = inngest.createFunction(
  { id: "Extract PDF and Save to Database" },
  { event: Events.EXTRACT_DATA_FROM_PDF_AND_SAVE_TO_DATABASE },
  async ({ event }) => {
    const result = await agentNetwork.run(
      `Extract the key data from this PDF: ${event.data.url}. Once the data is extracted, save it to the database using the receiptId: ${event.data.receiptId}. Once the receipt is successfully saved to the database you can terminate the agent process.`,
    );

    return result.state.kv.get("receipt");
  },
);

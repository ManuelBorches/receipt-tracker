import { Inngest } from "inngest";

// Create a new Inngest client to send and receive events
export const inngest = new Inngest({
  id: "receipt-tracker-inggest-client",
});

"use server";

import { currentUser } from "@clerk/nextjs/server";

// Initialize Schematic SDK
import { SchematicClient } from "@schematichq/schematic-typescript-node";
const apiKey = process.env.SCHEMATIC_API_KEY;
const client = new SchematicClient({ apiKey });

// Get a temporary access token
export async function getTemporaryAccessToken() {
  /* const resp = await client.accesstokens.issueTemporaryAccessToken({
    resourceType: "company",
    lookup: { companyId }, // The lookup will vary depending on how you have configured your company keys
  });

  return resp.data?.token; */

  console.log("Getting temporary access token:");
  const user = await currentUser();

  if (!user) {
    console.log("User not found, returning null");
    return null;
  }

  console.log(`Issuing temporary access token for user: ${user.id}`);

  const resp = await client.accesstokens.issueTemporaryAccessToken({
    resourceType: "company",
    // lookup: { userId: user.id }, // The lookup will vary depending on how you have configured your company keys
    lookup: { id: user.id },
  });

  console.log(
    "Temporary access token received:",
    resp.data ? "Token received" : "No token in response",
  );
  return resp.data?.token;
}

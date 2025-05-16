import { ConvexHttpClient } from "convex/browser";

// Create a Convex HTTP client instance for server-side actions
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default convex;

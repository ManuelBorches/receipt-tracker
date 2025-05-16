import { getTemporaryAccessToken } from "@/actions/getTemporaryAccessToken";
import { SchematicEmbed } from "./SchematicEmbed";

export const SchematicComponet = async ({
  componentId,
}: {
  componentId?: string;
}) => {
  if (!componentId) {
    console.log("Component ID is required");
    return null;
  }

  const accessToken = await getTemporaryAccessToken();

  if (!accessToken) {
    console.log("Access token is required");
    throw new Error("Access token is required for user");
  }

  return <SchematicEmbed accessToken={accessToken} componentId={componentId} />;
};

import { app, InvocationContext, Timer } from "@azure/functions";
import { Client } from "@microsoft/microsoft-graph-client";
import * as msal from "@azure/msal-node";

// MSAL Configuration
const msalConfig = {
  auth: {
    clientId: process.env.CLIENT_ID!,
    authority: `https://login.microsoftonline.com/${process.env.TENANT_ID}`,
    clientSecret: process.env.CLIENT_SECRET!,
  },
};

// MSAL Client
const pca = new msal.ConfidentialClientApplication(msalConfig);

// Function to get an access token using delegated permissions
async function getAccessToken(context: InvocationContext): Promise<string> {
  try {
    // Replace this with the appropriate mechanism to retrieve a user's login details.
    const authCodeUrlParameters = {
      scopes: ["https://graph.microsoft.com/.default"],
      redirectUri: "http://localhost:8080", // Ensure this is set up in Azure AD
    };

    const authCodeResponse = await pca.acquireTokenByCode({
      code: "AUTHORIZATION_CODE", // Replace with the actual authorization code
      redirectUri: "http://localhost:8080", // Ensure this is set up in Azure AD
      scopes: ["User.Read", "Group.Read.All"], // Replace with necessary delegated scopes
    });

    if (!authCodeResponse) {
      throw new Error("Authentication failed. No access token acquired.");
    }

    context.log("Access token acquired via delegated permissions.");
    return authCodeResponse.accessToken!;
  } catch (error) {
    context.error("Error acquiring delegated access token:", error);
    throw error;
  }
}

// Main function triggered by a timer
export async function getData(
  myTimer: Timer,
  context: InvocationContext
): Promise<void> {
  context.log("Timer function processing request.");

  try {
    // Acquire the delegated access token
    const accessToken = await getAccessToken(context);
    context.log("Delegated access token acquired.");

    // Use the access token to fetch data
    const graphClient = getGraphClient(accessToken);
    const users = await graphClient.api("/users").get();

    context.log("Fetched users from Microsoft Graph:", users);
  } catch (error) {
    context.error("Error fetching data:", error);
  }
}

// Function to create a Graph client
function getGraphClient(accessToken: string): Client {
  return Client.init({
    authProvider: async (done) => {
      try {
        done(null, accessToken); // Pass the access token
      } catch (err) {
        done(err, null); // Handle the error
      }
    },
  });
}

// Timer trigger configuration
app.timer("getData", {
  schedule: "0 */15 * * * *", // Every 15 minutes
  handler: getData,
});

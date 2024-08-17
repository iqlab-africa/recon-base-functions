import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { DevUser } from "../models/testuser";
import { convertStreamToString, getSecret, setDataModels } from "../utils/util";
import { WebHook } from "../models/webhook.data";
const tag = "🥦 🥦 🥦 Webhook";
const KEY = "database-connection-json";

export async function webhook(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log(
    `🥦 🥦 🥦 Http function processed request for url "${request.url}"`
  );

  context.log(`${tag} webhook started. will do whatever is required`);
  context.log(`${tag} request URL: ${request.url}`);
  context.log(`${tag} request body: ${request.body}`);


  const json = JSON.parse(await convertStreamToString(request.body));
  context.log(
    `${tag}  incoming data for insertion into Postgres: ${JSON.stringify(json)}`
  );

  try {
    const s = await getSecret(KEY);
    const sequelize = await setDataModels(s);

    const webhookData = new WebHook({
      robotName: json.robotName,
      date: `${new Date().toISOString()}`,
      robotDate: json.robotDate,
      emoji: json.emoji,
      numberProcessed: json.processed,
      webhookId: new Date().getTime(),
    });
    await webhookData.save();

    context.log(`${tag} ... webhookData inserted successfully! 🥬🥬🥬`);
  } catch (error) {
    context.error(`webhookData insert failed : ${error}`);
    return { status: 400, body: `webhookData insert failed. ${error}` };
  }

  return { status: 200, body: `🥦 🥦 🥦 Webhook is OK, how about you?` };
};

app.http("webhook", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: webhook,
});

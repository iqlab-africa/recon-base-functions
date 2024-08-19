import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { getSecret, setDataModels } from "../utils/util";
import { WebHook } from "../models/webhook.data";
const tag = "🌼 🌼 🌼 webhookList";
const KEY = "database-connection-json";

export async function webhookList(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(
    `${tag} Http function processing request for url "${request.url}"`
  );

  try {
    const s = await getSecret(KEY);
    const sequelize = await setDataModels(s);

    const list = await WebHook.findAll({ order: [["webhookId", "DESC"]], limit: 50 });
    context.log(`${tag} ... ${list.length} WebHooks found successfully! 🥬🥬🥬`);

    return { status: 200, body: JSON.stringify(list) };
  } catch (error) {
    context.error(`webhookList failed : ${error}`);
    return { status: 400, body: `WebHookList failed. ${error}` };
  }
}

app.http("webhookList", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: webhookList,
});

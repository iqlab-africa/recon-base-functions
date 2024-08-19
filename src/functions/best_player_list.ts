import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { convertStreamToString, getSecret, setDataModels } from "../utils/util";
import { BestPlayer } from "../models/best_player";
const tag = "🌼 🌼 🌼 BestPlayerList";
const KEY = "database-connection-json";

export async function bestPlayerList(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(
    `${tag} Http function processing request for url "${request.url}"`
  );

  try {
    const s = await getSecret(KEY);
    const sequelize = await setDataModels(s);

    const list = await BestPlayer.findAll({
      order: [["bestPlayerId", "DESC"]],
      limit: 50,
    });
    context.log(
      `${tag} ... ${list.length} BestPlayers found successfully! 🥬🥬🥬`
    );

    return { status: 200, body: JSON.stringify(list) };
  } catch (error) {
    context.error(`bestPlayerList failed : ${error}`);
    return { status: 400, body: `BestPlayerList failed. ${error}` };
  }
}

app.http("bestPlayerList", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: bestPlayerList,
});

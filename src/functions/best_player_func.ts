import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { DevUser } from "../models/testuser";
import { convertStreamToString, getSecret, setDataModels } from "../utils/util";
import { WebHook } from "../models/webhook.data";
import { BestPlayer } from "../models/best_player";
const tag = "🌼 🌼 🌼 BestPlayer";
const KEY = "database-connection-json";

export async function bestPlayer(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log(
    `${tag} Http function processed request for url "${request.url}"`
  );

  context.log(`${tag} bestPlayer started. will do whatever is required`);
  context.log(`${tag} request URL: ${request.url}`);
  context.log(`${tag} request body: ${request.body}`);


  const json = JSON.parse(await convertStreamToString(request.body));
  context.log(
    `${tag}  incoming data for insertion into Postgres: ${JSON.stringify(json)}`
  );

  try {
    const s = await getSecret(KEY);
    const sequelize = await setDataModels(s);

    const bestPlayer = new BestPlayer({
      robotName: json.robotName,
      date: `${new Date().toISOString()}`,
      robotDate: json.robotDate,
      bestPlayer: json.bestPlayer,
      bestPlayerId: new Date().getTime(),
    });
    await bestPlayer.save();

    context.log(`${tag} ... bestPlayer inserted successfully! 🥬🥬🥬`);
  } catch (error) {
    context.error(`bestPlayer insert failed : ${error}`);
    return { status: 400, body: `bestPlayer insert failed. ${error}` };
  }

  return { status: 200, body: `🥦 🥦 🥦 bestPlayer ${json.bestPlayer} is OK, how about you?` };
};

app.http("bestPlayer", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: bestPlayer,
});

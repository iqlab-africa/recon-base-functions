import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { Client } from "pg";

import { Sequelize } from "sequelize-typescript";
import { DevUser } from "../models/testuser";
import {
  getSecret,
  setDataModels,
  convertStreamToString,
} from "../utils/util";

const KEY = "database-connection-json";
const tag = "🍎 AddDevUser ";
/**
 *
 * @param request DataFunction writes data from Postgres
 * @param context
 * @returns
 */
export async function AddDevUser(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`\n\n🧡 AddDevUser processing request: ${new Date()}`);

  //get request body json
  const json = JSON.parse(await convertStreamToString(request.body));
  context.log(
    `${tag}  incoming data for insertion into Postgres: ${JSON.stringify(json)}`
  );

  try {
    const s = await getSecret(KEY);
    const sequelize = await setDataModels(s);
    //
    const uname = json.name;
    context.log(`INSERT THIS using Sequelize: 🔵 name: ${uname} 🔵 `);
    const user = new DevUser({
      name: uname,
      date: `${new Date().toISOString()}`,
      userId: new Date().getTime(),
    });
    await user.save();

    context.log(`${tag} ... user inserted successfully! 🥬🥬🥬`);
  } catch (error) {
    context.error(`user insert failed : ${error}`);
    return { status: 400, body: `user insert failed. ${error}` };
  }

  return {
    status: 200,
    body: "🔵 🔵 DevUser inserted to Postgres 🍎 robotdb OK! 🔵 🔵",
  };
}

app.http("addDevUser", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: AddDevUser,
});

//
//
export async function ListDevUsers(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`🧡 ListDevUsers processed request for url "${request.url}"`);

  try {
    const s = await getSecret(KEY);
    const sequelize = await setDataModels(s);
    const rows: DevUser[] = await DevUser.findAll();
    context.log(`${tag} number of rows from client: ${rows.length}`);
    const jsonList = rows.map((row) => JSON.stringify(row));
    context.log(`\n🧡 🧡 🧡 🧡 Users found: ${jsonList}`);
    return { status: 200, body: JSON.stringify(jsonList, null, 4) };
  } catch (error) {
    context.error("Problem listing dev users");
    return { status: 400, body: "Unable to list dev users: " + error };
  }
}

app.http("listDevUsers", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: ListDevUsers,
});

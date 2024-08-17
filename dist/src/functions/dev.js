"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListDevUsers = exports.AddDevUser = void 0;
const functions_1 = require("@azure/functions");
const testuser_1 = require("../models/testuser");
const util_1 = require("../utils/util");
const KEY = "database-connection-json";
const tag = "🍎 AddDevUser ";
/**
 *
 * @param request DataFunction writes data from Postgres
 * @param context
 * @returns
 */
function AddDevUser(request, context) {
    return __awaiter(this, void 0, void 0, function* () {
        context.log(`\n\n🧡 AddDevUser processing request: ${new Date()}`);
        //get request body json
        const json = JSON.parse(yield (0, util_1.convertStreamToString)(request.body));
        context.log(`${tag}  incoming data for insertion into Postgres: ${JSON.stringify(json)}`);
        try {
            const s = yield (0, util_1.getSecret)(KEY);
            const sequelize = yield (0, util_1.setDataModels)(s);
            //
            const uname = json.name;
            context.log(`INSERT THIS using Sequelize: 🔵 name: ${uname} 🔵 `);
            const user = new testuser_1.DevUser({
                name: uname,
                date: `${new Date().toISOString()}`,
                userId: new Date().getTime(),
            });
            yield user.save();
            context.log(`${tag} ... user inserted successfully! 🥬🥬🥬`);
        }
        catch (error) {
            context.error(`user insert failed : ${error}`);
            return { status: 400, body: `user insert failed. ${error}` };
        }
        return {
            status: 200,
            body: "🔵 🔵 DevUser inserted to Postgres 🍎 robotdb OK! 🔵 🔵",
        };
    });
}
exports.AddDevUser = AddDevUser;
functions_1.app.http("addDevUser", {
    methods: ["POST"],
    authLevel: "anonymous",
    handler: AddDevUser,
});
//
//
function ListDevUsers(request, context) {
    return __awaiter(this, void 0, void 0, function* () {
        context.log(`🧡 ListDevUsers processed request for url "${request.url}"`);
        try {
            const s = yield (0, util_1.getSecret)(KEY);
            const sequelize = yield (0, util_1.setDataModels)(s);
            const rows = yield testuser_1.DevUser.findAll();
            context.log(`${tag} number of rows from client: ${rows.length}`);
            const jsonList = rows.map((row) => JSON.stringify(row));
            context.log(`\n🧡 🧡 🧡 🧡 Users found: ${jsonList}`);
            return { status: 200, body: JSON.stringify(jsonList, null, 4) };
        }
        catch (error) {
            context.error("Problem listing dev users");
            return { status: 400, body: "Unable to list dev users: " + error };
        }
    });
}
exports.ListDevUsers = ListDevUsers;
functions_1.app.http("listDevUsers", {
    methods: ["GET"],
    authLevel: "anonymous",
    handler: ListDevUsers,
});
//# sourceMappingURL=dev.js.map
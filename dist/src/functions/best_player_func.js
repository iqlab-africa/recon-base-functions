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
exports.bestPlayer = void 0;
const functions_1 = require("@azure/functions");
const util_1 = require("../utils/util");
const best_player_1 = require("../models/best_player");
const tag = "🥦 🥦 🥦 Webhook";
const KEY = "database-connection-json";
function bestPlayer(request, context) {
    return __awaiter(this, void 0, void 0, function* () {
        context.log(`🥦 🥦 🥦 Http function processed request for url "${request.url}"`);
        context.log(`${tag} bestPlayer started. will do whatever is required`);
        context.log(`${tag} request URL: ${request.url}`);
        context.log(`${tag} request body: ${request.body}`);
        const json = JSON.parse(yield (0, util_1.convertStreamToString)(request.body));
        context.log(`${tag}  incoming data for insertion into Postgres: ${JSON.stringify(json)}`);
        try {
            const s = yield (0, util_1.getSecret)(KEY);
            const sequelize = yield (0, util_1.setDataModels)(s);
            const bestPlayer = new best_player_1.BestPlayer({
                robotName: json.robotName,
                date: `${new Date().toISOString()}`,
                robotDate: json.robotDate,
                bestPlayer: json.bestPlayer,
                bestPlayerId: new Date().getTime(),
            });
            yield bestPlayer.save();
            context.log(`${tag} ... bestPlayer inserted successfully! 🥬🥬🥬`);
        }
        catch (error) {
            context.error(`bestPlayer insert failed : ${error}`);
            return { status: 400, body: `bestPlayer insert failed. ${error}` };
        }
        return { status: 200, body: `🥦 🥦 🥦 bestPlayer ${json.bestPlayer} is OK, how about you?` };
    });
}
exports.bestPlayer = bestPlayer;
;
functions_1.app.http("bestPlayer", {
    methods: ["GET", "POST"],
    authLevel: "anonymous",
    handler: bestPlayer,
});
//# sourceMappingURL=best_player_func.js.map
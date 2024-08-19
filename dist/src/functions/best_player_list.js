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
exports.bestPlayerList = void 0;
const functions_1 = require("@azure/functions");
const util_1 = require("../utils/util");
const best_player_1 = require("../models/best_player");
const tag = "🌼 🌼 🌼 BestPlayerList";
const KEY = "database-connection-json";
function bestPlayerList(request, context) {
    return __awaiter(this, void 0, void 0, function* () {
        context.log(`${tag} Http function processing request for url "${request.url}"`);
        try {
            const s = yield (0, util_1.getSecret)(KEY);
            const sequelize = yield (0, util_1.setDataModels)(s);
            const list = yield best_player_1.BestPlayer.findAll({
                order: [["bestPlayerId", "DESC"]],
                limit: 50,
            });
            context.log(`${tag} ... ${list.length} BestPlayers found successfully! 🥬🥬🥬`);
            return { status: 200, body: JSON.stringify(list) };
        }
        catch (error) {
            context.error(`bestPlayerList failed : ${error}`);
            return { status: 400, body: `BestPlayerList failed. ${error}` };
        }
    });
}
exports.bestPlayerList = bestPlayerList;
functions_1.app.http("bestPlayerList", {
    methods: ["GET", "POST"],
    authLevel: "anonymous",
    handler: bestPlayerList,
});
//# sourceMappingURL=best_player_list.js.map
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
exports.setDataModels = exports.getSecret = exports.convertStreamToString = void 0;
const identity_1 = require("@azure/identity");
const keyvault_secrets_1 = require("@azure/keyvault-secrets");
const sequelize_typescript_1 = require("sequelize-typescript");
const testuser_1 = require("../models/testuser");
const book_1 = require("../models/book");
const webhook_data_1 = require("../models/webhook.data");
const f0 = "robot-keys-2";
const f1 = ".vault";
const f2 = ".azure.net";
const h1 = "https://";
function convertStreamToString(stream) {
    return __awaiter(this, void 0, void 0, function* () {
        const reader = stream.getReader();
        const decoder = new TextDecoder();
        let result = "";
        while (true) {
            const { done, value } = yield reader.read();
            if (done)
                break;
            result += decoder.decode(value, { stream: true });
        }
        return result;
    });
}
exports.convertStreamToString = convertStreamToString;
function getSecret(keyName) {
    return __awaiter(this, void 0, void 0, function* () {
        const vault_url = `${h1}${f0}${f1}${f2}/`;
        console.log(`🍐 key vault: ${vault_url}`);
        let result = "";
        try {
            const credential = new identity_1.DefaultAzureCredential();
            const client = new keyvault_secrets_1.SecretClient(vault_url, credential);
            // Read the secret we created
            const encodedKeyName = encodeURIComponent(keyName);
            const secret = yield client.getSecret(encodedKeyName);
            result = secret.value;
            return result;
        }
        catch (error) {
            console.log(`Failed ${error}`);
            throw error;
        }
        return result;
    });
}
exports.getSecret = getSecret;
function setDataModels(dbJson) {
    return __awaiter(this, void 0, void 0, function* () {
        const j = JSON.parse(dbJson);
        console.log(`💛 ...... setDataModels: ${dbJson}`);
        const sequelize = new sequelize_typescript_1.Sequelize(j.dbname, j.user, j.password, {
            host: j.host,
            dialect: "postgres",
        });
        yield sequelize.authenticate();
        sequelize.addModels([testuser_1.DevUser, book_1.DevBook, webhook_data_1.WebHook]);
        testuser_1.DevUser.hasMany(book_1.DevBook, { foreignKey: "userId" });
        book_1.DevBook.belongsTo(testuser_1.DevUser, { foreignKey: "userId" });
        console.log("\n\n💛💛💛💛 Data models set up");
        return sequelize;
    });
}
exports.setDataModels = setDataModels;
//# sourceMappingURL=util.js.map
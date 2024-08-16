import { DefaultAzureCredential } from "@azure/identity";
import { KeyVaultSecret, SecretClient } from "@azure/keyvault-secrets";
import { Sequelize } from "sequelize-typescript";
import { ReadableStream } from "stream/web";
import { DevUser } from "../models/testuser";
import { DevBook } from "../models/book";


export async function streamToString(stream: ReadableStream) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let result = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    result += decoder.decode(value, { stream: true });
  }

  return result;
}

export async function getDatabaseConnection(keyName: string): Promise<string> {
  const vault_url = "https://robot-keys-2.vault.azure.net/";
  let result = "";
  try {
    const credential = new DefaultAzureCredential();
    const client: SecretClient = new SecretClient(vault_url, credential);
    // Read the secret we created
    const encodedKeyName = encodeURIComponent(keyName);
    const secret: KeyVaultSecret = await client.getSecret(encodedKeyName);
    result = secret.value;
    return result;
  } catch (error) {
    console.log(`Failed ${error}`);
    throw error;
  }

  return result;
}

export async function setDataModels(dbJson: string): Promise<Sequelize> {
  const j = JSON.parse(dbJson);
  console.log(`💛 ...... setDataModels: ${dbJson}`);


  const sequelize = new Sequelize(j.dbname, j.user, j.password, {
    host: j.host,
    dialect: "postgres",
  });

  await sequelize.authenticate();
  sequelize.addModels([DevUser, DevBook]);
  DevUser.hasMany(DevBook, { foreignKey: "userId" });
  DevBook.belongsTo(DevUser, { foreignKey: "userId" });

  console.log("\n\n💛💛💛💛 Data models set up");
  return sequelize;
}

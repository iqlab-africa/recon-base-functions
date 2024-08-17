import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { ReadableStream } from "stream/web";

import { ContainerClient } from "@azure/storage-blob";
import { convertStreamToString, getSecret } from "../utils/util";

const container = "robotcontainer";
const tag = "🔵🔵🔵 DownloaderFunction 🍎 ";
const KEY = "storage-connection-string";
const err = "👿 👿 👿";

export async function download(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  //
  context.log(`${tag} request URL: ${request.url}`);

  const storageConnectionString = await getSecret(KEY);
  const containerClient = new ContainerClient(
    storageConnectionString,
    container
  );

  const json = JSON.parse(await convertStreamToString(request.body));
  context.log(`${tag} incoming json: ${JSON.stringify(json)}`);

  try {
    const blobClient = containerClient.getBlobClient(json.fileName);
    const filename = json.fileName;
    const extension = filename.split(".").pop();

    if (extension !== "xlsx" && extension !== "csv") {
      return {
        status: 400,
        body: `${err} Unknown file type. Should be csv or xlsx`,
      };
    }
    if (extension === "xlsx") {
      context.log(`${tag} downloading Excel file: ${filename} ...`);
      const downloadResponse = await blobClient.downloadToBuffer();
     if (downloadResponse.buffer.byteLength > 0) {
         const arrayBuffer = downloadResponse.buffer; // ArrayBuffer directly
         const textDecoder = new TextDecoder();
         const convertedString = textDecoder.decode(arrayBuffer);
         context.log(`${tag} downloaded spreadsheet ...\n${convertedString}`);
         return { status: 200, body: convertedString };
     } else {
         return { status: 400, body: `${err} File not found` };
     }
    } else {
      context.log(`${tag} downloading .csv file: ${filename} ...`);
      const downloadResponse = await blobClient.download();
      if (
        downloadResponse.contentLength &&
        downloadResponse.contentLength > 1
      ) {
        const readableStream = downloadResponse.readableStreamBody;
        const streamToBuffer = await getData(readableStream);
        const result = streamToBuffer.toString();
        context.log(
          `${tag} File content downloaded ... \n${result}\n\n 
           🍎 🍎 🍎 We are done, Boss! 🥬\n`
        );
        return { status: 200, body: result };
      } else {
        return { status: 400, body: `${err} File not found` };
      }
    }
  } catch (error) {
    return {
      status: 500,
      body: `${err}  File download error occurred: ${error.message}`,
    };
  }
  async function getData(readableStream: NodeJS.ReadableStream) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      readableStream.on("data", (data) => {
        chunks.push(data instanceof Buffer ? data : Buffer.from(data));
      });
      readableStream.on("end", () => {
        resolve(Buffer.concat(chunks));
      });
      readableStream.on("error", reject);
    });
  }
}

app.http("download", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: download,
});

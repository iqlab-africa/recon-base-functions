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
exports.download = void 0;
const functions_1 = require("@azure/functions");
const storage_blob_1 = require("@azure/storage-blob");
const util_1 = require("../utils/util");
const container = "robotcontainer";
const tag = "🔵🔵🔵 DownloaderFunction 🍎 ";
const KEY = "storage-connection-string";
const err = "👿 👿 👿";
function download(request, context) {
    return __awaiter(this, void 0, void 0, function* () {
        //
        context.log(`${tag} request URL: ${request.url}`);
        const storageConnectionString = yield (0, util_1.getSecret)(KEY);
        const containerClient = new storage_blob_1.ContainerClient(storageConnectionString, container);
        const json = JSON.parse(yield (0, util_1.convertStreamToString)(request.body));
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
                const downloadResponse = yield blobClient.downloadToBuffer();
                if (downloadResponse.buffer.byteLength > 0) {
                    const arrayBuffer = downloadResponse.buffer; // ArrayBuffer directly
                    const textDecoder = new TextDecoder();
                    const convertedString = textDecoder.decode(arrayBuffer);
                    context.log(`${tag} downloaded spreadsheet ...\n${convertedString}`);
                    return { status: 200, body: convertedString };
                }
                else {
                    return { status: 400, body: `${err} File not found` };
                }
            }
            else {
                context.log(`${tag} downloading .csv file: ${filename} ...`);
                const downloadResponse = yield blobClient.download();
                if (downloadResponse.contentLength &&
                    downloadResponse.contentLength > 1) {
                    const readableStream = downloadResponse.readableStreamBody;
                    const streamToBuffer = yield getData(readableStream);
                    const result = streamToBuffer.toString();
                    context.log(`${tag} File content downloaded ... \n${result}\n\n 
           🍎 🍎 🍎 We are done, Boss! 🥬\n`);
                    return { status: 200, body: result };
                }
                else {
                    return { status: 400, body: `${err} File not found` };
                }
            }
        }
        catch (error) {
            return {
                status: 500,
                body: `${err}  File download error occurred: ${error.message}`,
            };
        }
        function getData(readableStream) {
            return __awaiter(this, void 0, void 0, function* () {
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
            });
        }
    });
}
exports.download = download;
functions_1.app.http("download", {
    methods: ["POST"],
    authLevel: "anonymous",
    handler: download,
});
//# sourceMappingURL=download.js.map
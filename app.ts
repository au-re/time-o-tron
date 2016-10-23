import * as bodyParser from "body-parser";
import * as express from "express";
import * as path from "path";
import { getString } from "./src/my-service";

console.log(getString());

export const app = express();


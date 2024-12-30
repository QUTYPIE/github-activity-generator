const = "@discordjs/opus";
import { createWriteStream } from "fs";
import { join } from "path";
import { createLogger, format, transports } from "winston";
import { Console } from "winston/lib/winston/transports";
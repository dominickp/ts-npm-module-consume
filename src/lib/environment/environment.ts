const chalk = require('chalk');
const fs = require('fs');

const winston = require('winston');
winston.emitErrs = true;

import {Logger} from "./logger";

export class Environment {

    protected options: Options;

    protected logger: Logger;

    constructor(options?: Options){

        this.options = options;

        this.logger = new Logger(this.options);
    }

    log(type: number, message: string){
        this.logger.log(type, message);
    }
}
import { Nest } from "./nest";
import { FileJob } from "./../job/fileJob";
import { Environment } from "../environment/environment";
export declare class FtpNest extends Nest {
    protected client: any;
    protected config: {};
    protected checkEvery: number;
    protected checkEveryMs: number;
    constructor(e: Environment, host: string, port: number, username: string, password: string, checkEvery: number);
    protected getClient(): any;
    load(): void;
    watch(): void;
    arrive(job: FileJob): void;
    take(job: FileJob, callback: any): void;
}

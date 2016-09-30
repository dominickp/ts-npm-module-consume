import { Environment } from "../environment/environment";
import { Nest } from "./nest";
import { WebhookJob } from "../job/webhookJob";
export declare class WebhookNest extends Nest {
    protected path: string;
    protected httpMethod: string;
    /**
     * Webhook Nest constructor
     * @param e
     * @param path
     * @param httpMethod
     */
    constructor(e: Environment, path: string | string[], httpMethod: string);
    /**
     * Set the path as a string or a string array. All parts are URI encoded.
     * Create directory structures with an array: ["one", "two"] results in "/one/two".
     * @param path
     */
    setPath(path: any): void;
    /**
     * Get the path.
     * @returns {string}
     */
    getPath(): string;
    /**
     * Get the HTTP method.
     * @returns {string}
     */
    getHttpMethod(): string;
    /**
     * Set the HTTP method.
     * @param httpMethod
     */
    protected setHttpMethod(httpMethod: any): void;
    /**
     * Get the name.
     * @returns {string}
     */
    getName(): string;
    /**
     * On load, do nothing.
     */
    load(): void;
    /**
     * Add webhook to server watch list.
     */
    watch(): void;
    /**
     * Creates a new job
     * @param job
     */
    arrive(job: WebhookJob): void;
}
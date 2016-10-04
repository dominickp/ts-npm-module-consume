import { Logger } from "./logger";
import { WebhookNest } from "../nest/webhookNest";
import { WebhookInterface } from "../ui/webhookInterface";
import { Server } from "./server";
export declare class Environment {
    protected options: AntfarmOptions;
    protected logger: Logger;
    protected server: any;
    protected server2: Server;
    protected hookRoutes: any[];
    protected hookInterfaceRoutes: any[];
    constructor(options: AntfarmOptions);
    protected setOptions(options: AntfarmOptions): void;
    /**
     * Get the Antfarm options.
     * @returns {AntfarmOptions}
     */
    getOptions(): AntfarmOptions;
    getAutoManagedFolderDirectory(): string;
    /**
     * Creates the server.
     */
    protected createServer(): void;
    /**
     * Adds a webhook to the webhook server.
     * @param nest
     */
    addWebhook(nest: WebhookNest): void;
    /**
     * Adds a webhook interface to the webhook server.
     * @param ui
     */
    addWebhookInterface(ui: WebhookInterface): void;
    toString(): string;
    log(type: number, message: string, actor?: any, instances?: any[]): void;
}

import { Tunnel } from '../tunnel/tunnel'
import { Job } from '../job/job'
import {Environment} from "../environment/environment";

export abstract class Nest {
    name: string;

    tunnel: Tunnel;

    protected e: Environment;

    constructor(e: Environment, name: string) {
        this.e = e;
        this.name = name;
    }

    register(tunnel: Tunnel){
        this.tunnel = tunnel;
    }

    arrive(job: Job) {
        this.e.log(1, `Job "${job.name}" arrived in Nest "${this.name}".`);
        job.tunnel = this.tunnel;
        this.tunnel.arrive(job, this);
    }
}
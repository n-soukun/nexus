import EventEmitter from "events";

export type LogEventHandler = (log: {
    error: boolean;
    message: string;
}) => void;

export class Logger {
    private eventEmitter: EventEmitter;

    constructor() {
        this.eventEmitter = new EventEmitter();
    }

    on(event: "log", listener: LogEventHandler): void {
        this.eventEmitter.on(event, listener);
    }

    off(event: "log", listener: LogEventHandler): void {
        this.eventEmitter.off(event, listener);
    }

    log(message: string): void {
        this.eventEmitter.emit("log", {
            error: false,
            message,
        });
    }

    error(message: string): void {
        this.eventEmitter.emit("log", {
            error: true,
            message,
        });
    }
}

export class Logger {
  private static logger?: Logger;
  private options: LoggerOptions = {
    production: true,
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getLogger(): Logger {
    if (this.logger === undefined) {
      this.logger = new Logger();
    }
    return this.logger;
  }

  public init(options: Partial<LoggerOptions>): void {
    this.options = {
      ...this.options,
      ...options,
    };
  }

  public error(error: Error): void {
    // TODO allow customised error printing
    if (!this.options.production) {
      console.error(error);
      console.error('Error cause:', error.cause || 'Unknown');
    }
    // TODO send errors to server
  }

  public debug(messageComponents: unknown[]): void {
    if (!this.options.production) console.debug(...messageComponents);
  }
}

interface LoggerOptions {
  production: boolean;
}

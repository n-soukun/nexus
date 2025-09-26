export type HTTPServerStatus =
    | {
          running: true;
          port: number;
      }
    | {
          running: false;
          port: null;
      };

export interface HTTPServerConfig {
    port: number;
}

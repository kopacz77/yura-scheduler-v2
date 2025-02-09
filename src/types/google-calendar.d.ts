declare module 'google-auth-library' {
  export class JWT {
    constructor(options: {
      email?: string;
      key?: string;
      scopes?: string[];
    });
  }
}

declare module 'googleapis' {
  export const google: {
    calendar: (options: { version: string; auth: any }) => {
      events: {
        insert: (params: any) => Promise<any>;
        delete: (params: any) => Promise<any>;
        update: (params: any) => Promise<any>;
      };
    };
  };
}

import { Request, Response } from "express";
export declare const createEntry: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateEntry: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getEntries: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getEntry: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteEntry: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=entryController.d.ts.map


import { config } from '../playwright.config';

//Root
export const erickVar: string = config.use?.erickVar ?? '';
export const erickVarString: string = config.use?.erickVarString ?? '';
export const erickVarInt: number = config.use?.erickVarInt ?? 0;
export const erickVarFloat: number = config.use?.erickVarFloat ?? 0;
export const erickVarBoolean: boolean = config.use?.erickVarBoolean ?? false;
export const baseURL:string = config.use?.baseURL?? '';

//Node myCredentials
export const myUsername: string = config.use?.myUsername ?? '';
export const myPassword: string = config.use?.myPassword ?? '';
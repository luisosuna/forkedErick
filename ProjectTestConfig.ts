import { PlaywrightTestConfig } from "@playwright/test"; 

export interface ProjectTestConfig extends PlaywrightTestConfig {
    use?:PlaywrightTestConfig['use'] & {
      erickVar?: string;
      erickVarString?: string;
      erickVarInt?: number;
      erickVarFloat?: number;
      erickVarBoolean?: boolean;
      myUsername?: string;
      myPassword?: string;
    }
}
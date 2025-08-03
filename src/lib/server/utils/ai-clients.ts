import OpenAI from "openai";

import { openAiEnvConfig } from "./env-config";

export const openAiClient = new OpenAI({ apiKey: openAiEnvConfig.apiKey });

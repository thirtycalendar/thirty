import OpenAI from "openai";

import { openAiEnvConfig } from "$lib/shared/utils/env-configs";

export const openAiClient = new OpenAI({ apiKey: openAiEnvConfig.apiKey });

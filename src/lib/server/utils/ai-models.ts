import { createOpenAI } from "@ai-sdk/openai";

import { openAiEnvConfig } from "$lib/shared/utils/env-configs";

const openAiModel = createOpenAI({ apiKey: openAiEnvConfig.apiKey });

export const gpt4oMini = openAiModel("gpt-4o-mini");

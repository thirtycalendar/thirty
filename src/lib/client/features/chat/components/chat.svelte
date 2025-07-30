<script lang="ts">
  import { Chat } from "@ai-sdk/svelte";

  import { chatModal } from "$lib/client/stores/modal";

  import { getChats, getMessages } from "../query";

  import { ChatView } from ".";

  const { data: chats, refetch: refetchChats } = getChats();

  const { currentDetails: currentChatDetails } = chatModal;
  const currentChat = $derived.by(() => $chats?.find((c) => c.id === $currentChatDetails?.id));
  const currentChatId = $derived.by(() => currentChat?.id ?? "");

  const { data: messages } = $derived.by(() => getMessages(currentChatId));

  const chat = $derived.by(() => {
    return new Chat({
      maxSteps: 30,
      initialMessages: $messages ?? [],
      body: { chatId: currentChatId || crypto.randomUUID() },
      async onFinish() {
        await refetchChats();
      }
    });
  });
</script>

<ChatView {chat} />

<script lang="ts">
  import { Chat } from "@ai-sdk/svelte";

  import { chatModal } from "$lib/client/stores/modal";

  import { getBirthdays } from "../../birthday/query";
  import { getCalendars } from "../../calendar/query";
  import { getEvents } from "../../event/query";
  import { getHolidayCountries, getHolidays } from "../../holiday/query";
  import { getChats, getMessages } from "../query";

  import { ChatView } from ".";

  const { data: chats, refetch: refetchChats } = getChats();

  const { currentDetails: currentChatDetails } = chatModal;
  const currentChat = $derived.by(() => $chats?.find((c) => c.id === $currentChatDetails?.id));
  const currentChatId = $derived.by(() => currentChat?.id ?? "");

  const { data: messages, isPending } = $derived.by(() => getMessages(currentChatId));

  const chat = $derived.by(() => {
    return new Chat({
      maxSteps: 30,
      initialMessages: $messages ?? [],
      body: { chatId: currentChatId || crypto.randomUUID() },
      async onFinish() {
        await refetchChats();

        await getEvents().refetch();

        await getCalendars().refetch();

        await getBirthdays().refetch();

        await getHolidays().refetch();

        await getHolidayCountries().refetch();
      }
    });
  });
</script>

<ChatView {chat} isMessagesPending={$isPending} />

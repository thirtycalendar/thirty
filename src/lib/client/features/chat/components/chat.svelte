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

  const eventQuery = getEvents();
  const calendarQuery = getCalendars();
  const birthdayQuery = getBirthdays();
  const holidayQuery = getHolidays();
  const holidayCountriesQuery = getHolidayCountries();

  const chat = $derived.by(() => {
    return new Chat({
      maxSteps: 30,
      initialMessages: $messages ?? [],
      body: { chatId: currentChatId || crypto.randomUUID() },
      async onFinish(message) {
        await refetchChats();

        const toolsUsed = new Set(
          message.parts
            ?.filter((p) => p.type === "tool-invocation")
            .map((p) => p.toolInvocation.toolName)
        );

        if ([...toolsUsed].some((name) => name.includes("Calendar"))) await calendarQuery.refetch();
        if ([...toolsUsed].some((name) => name.includes("Event"))) await eventQuery.refetch();
        if ([...toolsUsed].some((name) => name.includes("Birthday"))) await birthdayQuery.refetch();
        if ([...toolsUsed].some((name) => name.includes("Holiday"))) {
          await holidayQuery.refetch();
          await holidayCountriesQuery.refetch();
        }
      }
    });
  });
</script>

<ChatView {chat} isMessagesPending={$isPending} />

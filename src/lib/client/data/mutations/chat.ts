import { activeChatId } from "$lib/client/components/chat/utils";
import { showToast } from "$lib/client/stores/toast";
import { createMutation } from "$lib/client/utils/query/create-mutation";
import { client } from "$lib/client/utils/rpc";

export function deleteAllChatsMutation() {
  return createMutation({
    mutationFn: async () => {
      const res = await client.api.chat.deleteAll.$delete();
      const data = await res.json();

      if (!data.success) throw new Error(data.message);

      return data;
    },
    onSuccess: (data) => {
      activeChatId.set("");
      showToast(data.message);
    },
    onError: (message: Error["message"]) => {
      showToast(message, true);
    },
    queryKeys: ["chats"]
  });
}

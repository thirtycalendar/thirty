<script lang="ts">
  import { createMutation } from "$lib/client/utils/query/create-mutation";
  import { authClient, client } from "$lib/client/utils/rpc";

  import { GoogleCalendar } from "../../icons";

  import { SyncButton } from "..";

  let successMessage = $state("");
  let errorMessage = $state("");

  const { mutate, isPending } = createMutation({
    mutationFn: async () => {
      const res = await client.api.sync.google.$post();
      const data = await res.json();

      if (!data.success) throw new Error(data.message);

      return data;
    },
    onMutate: () => {
      errorMessage = "";
    },
    onSuccess: (data) => {
      errorMessage = "";
      successMessage = data.message;

      setTimeout(() => {
        successMessage = "";
      }, 3000);
    },
    onError: (message: Error["message"]) => {
      errorMessage = message;
    },
    queryKeys: ["calendars", "events"]
  });

  async function handleReauth() {
    await authClient.linkSocial({ provider: "google" });
  }
</script>

<SyncButton
  provider="Google"
  handleSync={mutate}
  isPending={$isPending}
  {handleReauth}
  {successMessage}
  {errorMessage}
>
  <GoogleCalendar size={15} />
  Sync with Google Calendar
</SyncButton>

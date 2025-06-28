<script lang="ts">
  import { browser } from "$app/environment";
  import { beforeNavigate, goto } from "$app/navigation";

  import { GoogleCalendarIcon } from "$lib/client/components";
  import { showToast } from "$lib/client/stores/toast";
  import { createMutation } from "$lib/client/utils/query/create-mutation";
  import { authClient, client } from "$lib/client/utils/rpc";

  import { getCalendars } from "../../calendar/query";
  import { getEvents } from "../../event/query";

  let { mutate: googleMutate, isPending } = createMutation({
    mutationFn: async () => {
      const res = await client.api.sync.google.$post();

      if (res.ok) {
        const { message } = await res.json();
        return { message };
      }

      throw new Error("Failed to sync with Google Calendar");
    },
    onSuccess: async (data) => {
      showToast(data.message);
    },
    onError: async () => {
      await authClient.signOut();
      goto("/auth");
    },
    queryKeys: ["cal-list", "event-list"]
  });

  function syncGoogleCalendar() {
    googleMutate();
  }

  const unsavedChangesMessage =
    "Syncing is in progress. Leaving this page will stop it. Are you sure?";

  beforeNavigate(({ cancel }) => {
    if ($isPending && !window.confirm(unsavedChangesMessage)) {
      cancel();
    }
  });

  $effect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    if (browser && $isPending) {
      window.addEventListener("beforeunload", handleBeforeUnload);
      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  });
</script>

<div class="space-y-5">
  <div class="space-y-2">
    <p class="font-bold">Google</p>

    <button class="btn btn-primary" onclick={syncGoogleCalendar} disabled={$isPending}>
      <GoogleCalendarIcon size={16} />
      {$isPending ? "Syncing..." : "Google Calendar"}
    </button>
  </div>
</div>

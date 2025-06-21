<script lang="ts">
  import { GoogleCalendarIcon } from "$lib/client/components";
  import { createMutation } from "$lib/client/utils/query/create-mutation";
  import { client } from "$lib/client/utils/rpc";

  let { mutate: googleMutate, isPending } = createMutation({
    mutationFn: async () => {
      const res = await client.api.sync.google.$post();

      if (res.ok) {
        const { message } = await res.json();
        console.log("Message:", message);
      }
    },
    queryKeys: ["cal-list", "event-list"]
  });

  function syncGoogleCalendar() {
    googleMutate();
  }
</script>

<div class="space-y-5">
  <!-- Google -->
  <div class="space-y-2">
    <p class="font-bold">Google</p>

    <button class="btn btn-primary" onclick={syncGoogleCalendar} disabled={$isPending}>
      <GoogleCalendarIcon size={16} /> {$isPending ? "syncing..." : "Google Calendar"}</button
    >
  </div>
</div>

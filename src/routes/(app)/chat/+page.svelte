<script lang="ts">
  import { Chat, ChatModal } from "$lib/client/features/chat/components";
  import { Seo } from "$lib/client/components";

  let { data } = $props();
</script>

<Seo seo={data.seo} />

<Chat showIconOnHide={true} />

<ChatModal />

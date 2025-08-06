<script lang="ts">
  import { Calendar, Navbar } from "$lib/client/features/calendar/components";
  import { Chat, MiniChatMenu } from "$lib/client/features/chat/components";
  import { Seo, Sidebar } from "$lib/client/components";
  import { chatSidebarId, sidebars } from "$lib/client/stores/sidebar";

  let { data } = $props();
  let chatSidebarOpen = $derived($sidebars[chatSidebarId]);
</script>

<Seo seo={data.seo} />

<div class={`transition-all duration-300 ${chatSidebarOpen ? "mr-[340px]" : "mr-0"}`}>
  <Navbar />

  <Calendar />
</div>

<Sidebar sidebarId={chatSidebarId} className="w-[340px] right-0" mainSidebar={false}>
  <MiniChatMenu />

  <Chat />
</Sidebar>

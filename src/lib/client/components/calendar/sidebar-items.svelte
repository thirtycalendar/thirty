<script lang="ts">
  import { ProfileButton } from "../auth";

  import { ChangeCalViewButtons, SidebarCalendar } from ".";
</script>

<div class="relative h-screen">
  <div class="mx-2 flex items-center justify-between sm:hidden">
    <ChangeCalViewButtons />

    <ProfileButton />
  </div>

  <SidebarCalendar />
</div>

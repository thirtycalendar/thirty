<script lang="ts">
  import { ProfileButton } from "../auth";

  import { ChangeCalendarViewButtons, SidebarCalendar, SidebarSections } from ".";
</script>

<div class="relative flex h-screen flex-col space-y-3">
  <div class="mx-2 flex items-center justify-between sm:hidden">
    <ChangeCalendarViewButtons />

    <ProfileButton />
  </div>

  <SidebarCalendar />

  <SidebarSections />
</div>

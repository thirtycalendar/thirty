<script lang="ts">
  import { Appearance, Navbar } from "$lib/client/features/settings/components";
  import { Seo } from "$lib/client/components";

  let { data } = $props();
</script>

<Seo seo={data.seo} />

<Navbar title="Appearance" />

<Appearance />

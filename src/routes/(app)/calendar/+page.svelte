<script lang="ts">
  import { Seo } from "$lib/client/components";
  import { Navbar } from "$lib/client/components/calendar";

  let { data } = $props();
</script>

<Seo seo={data.seo} />

<Navbar />

Main calendar content

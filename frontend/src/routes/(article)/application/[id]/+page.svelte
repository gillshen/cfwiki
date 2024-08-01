<script lang="ts">
	import { Heading, Hr } from 'flowbite-svelte';

	export let data;
</script>

<Heading tag="h1" class="alt-page-title">Application {data.application.id}</Heading>

<Hr />

<pre class="text-sm bg-gray-50">{JSON.stringify(data.application, null, 2)}</pre>

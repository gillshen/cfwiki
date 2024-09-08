<script lang="ts">
	import { BreadcrumbItem } from 'flowbite-svelte';

	export let text;
	export let href;
</script>

<BreadcrumbItem {href}><span class="text-primary-700">{text}</span></BreadcrumbItem>

<script lang="ts">
	import Label from '$lib/components/ui/label/label.svelte';
	export let label: string;
</script>

<div class="flex flex-col gap-2">
	<Label>{label}</Label>
	<slot />
</div>

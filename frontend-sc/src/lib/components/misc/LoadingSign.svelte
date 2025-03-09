<script lang="ts">
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	export let text: string = 'Fetching data...';
</script>

<div class="flex gap-2 items-center">
	<LoaderCircle class="animate-spin w-4 h-4" />
	<div class="animate-pulse text-sm">{text}</div>
</div>

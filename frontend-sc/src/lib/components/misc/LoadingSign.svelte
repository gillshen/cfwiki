<script lang="ts">
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	export let text: string = 'Fetching data...';
</script>

<div>
	<LoaderCircle class="mr-2" />
	{text}
</div>

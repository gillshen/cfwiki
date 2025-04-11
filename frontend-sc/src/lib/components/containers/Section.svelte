<script lang="ts">
	export let id: string;
	export let title: string = '';
	export let hrule: boolean = false;
</script>

<section {id} class="pb-6 mb-2 space-y-2 text-sm">
	{#if title}
		<h2 class="text-xl font-bold pt-2">{title}</h2>
		<hr class="text-stone-400 pb-2" />
	{:else if hrule}
		<hr class="text-stone-400 pb-2" />
	{/if}
	<slot />
</section>

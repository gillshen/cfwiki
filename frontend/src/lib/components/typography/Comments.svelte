<script lang="ts">
	export let text: string;
	export let divClass: string = '';

	const wrapperClass = `flex flex-col gap-2 text-wrap ${divClass}`.trim();
</script>

<div class={wrapperClass}>
	{#each text.split(/\r?\n/g).filter(Boolean) as paragraph}
		<p>{paragraph}</p>
	{/each}
</div>

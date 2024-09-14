<script lang="ts">
	export let onClick: () => any;
	export let text: string;
	export let icon: any | undefined = undefined;
	export let disabled: boolean = false;

	const color = disabled ? 'text-gray-300' : 'text-gray-500 hover:text-primary-700';
</script>

<button on:click={onClick} class={`flex ${color}`} {disabled}>
	{#if icon}
		<svelte:component this={icon} class="size-4 me-1" />
	{/if}
	<span class="text-xs font-normal tracking-normal">{text}</span>
</button>

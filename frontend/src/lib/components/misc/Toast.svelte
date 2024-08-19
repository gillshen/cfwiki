<script lang="ts">
	import { Toast } from 'flowbite-svelte';
	import { CheckCircleSolid, ExclamationCircleSolid } from 'flowbite-svelte-icons';

	export let type: 'success' | 'error';
	export let onClose: () => void = () => {};
</script>

<Toast
	class="flex items-start rounded-md max-w-sm fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
	color={type === 'success' ? 'green' : 'red'}
	on:close={onClose}
>
	<svelte:fragment slot="icon">
		{#if type === 'success'}
			<CheckCircleSolid class="size-6" />
		{:else}
			<ExclamationCircleSolid class="size-6" />
		{/if}
	</svelte:fragment>
	<slot />
</Toast>

<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
</script>

<div class="flex flex-col w-full gap-8">
	<h1 class="text-2xl text-center">You're logged out</h1>

	<Button href="/login" class="w-36 mx-auto hover:no-underline">Log in</Button>
</div>

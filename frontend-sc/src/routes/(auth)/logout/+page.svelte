<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
</script>

<div class="w-fit h-[332px] flex flex-col justify-between m-auto pb-8">
	<div class="space-y-2 text-center">
		<h2 class="text-3xl font-bold">Keep Cool</h2>
		<p class="text-sm text-muted-foreground">insert inspring message</p>
	</div>

	<Button href="/login" class="w-[216px] mx-auto hover:no-underline">Log in</Button>
</div>

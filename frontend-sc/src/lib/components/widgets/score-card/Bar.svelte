<script lang="ts">
	import { cn } from '$lib/utils';

	export let value: number | null | undefined;
	export let maxValue: number;
	export let minValue: number = 0;
	export let damp: number = 1.7;

	const normalizedValue = (value ?? minValue - minValue) / (maxValue - minValue);
	const percentage = Math.pow(normalizedValue, damp);

	const FULL_HEIGHT = 72;
	const bgHeightClass = `h-[${FULL_HEIGHT}px]`;
	const barHeightClass = `h-[${Math.round(FULL_HEIGHT * percentage)}px]`;
</script>

<div class="group flex flex-col items-center cursor-default px-1">
	<div class={cn('relative w-[20px] rounded-sm bg-primary/10', bgHeightClass)}>
		<div
			class={cn(
				'absolute bottom-0 w-full rounded-sm bg-primary/80 group-hover:bg-primary/90 z-5',
				barHeightClass
			)}
		></div>
	</div>
	<div class="text-xs mt-1 tabular-nums text-primary/80 group-hover:text-primary/90">
		<slot />
	</div>
</div>

<script lang="ts">
	export let label: string;
</script>

<div class="flex flex-col gap-1 items-center">
	<div class="flex flex-wrap gap-2 h-[60px] max-w-[240px]">
		<slot />
	</div>
	<div class="text-gray-900 font-medium max-w-[60px] text-wrap text-center">
		{label}
	</div>
</div>

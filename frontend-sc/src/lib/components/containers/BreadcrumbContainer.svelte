<script lang="ts">
	import { cn } from '$lib/utils';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';

	export let includeHome: boolean = false;
	export let className: string = '';
	export { className as class };
</script>

<div class={cn('py-4 top-[60px] bg-transparent z-20', className)}>
	<Breadcrumb.Root>
		<Breadcrumb.List class="flex-nowrap truncate">
			{#if includeHome}
				<Breadcrumb.Item>
					<Breadcrumb.Link href="/home">Home</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
			{/if}
			<slot />
		</Breadcrumb.List>
	</Breadcrumb.Root>
</div>

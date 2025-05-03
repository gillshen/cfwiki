<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';
	export let includeHome: boolean = false;
</script>

<div class="py-4 sticky top-[60px] bg-white z-20">
	<Breadcrumb.Root>
		<Breadcrumb.List>
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

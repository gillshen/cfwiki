<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';
	export let home: boolean = false;
</script>

<div class="pt-2 pb-4 sticky top-[60px] bg-white z-20">
	<Breadcrumb.Root>
		<Breadcrumb.List>
			{#if !home}
				<Breadcrumb.Item>
					<Breadcrumb.Link href="/home">Home</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
			{/if}
			<slot />
		</Breadcrumb.List>
	</Breadcrumb.Root>
</div>

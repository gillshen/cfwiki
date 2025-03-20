<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';
	import { Separator } from 'bits-ui';
	export let home: boolean = false;
</script>

<div class="pt-2 pb-4">
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

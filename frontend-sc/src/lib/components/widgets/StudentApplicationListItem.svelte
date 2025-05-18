<script lang="ts">
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import ApplicationStatusSign from '$lib/components/misc/ApplicationStatusSign.svelte';
	import type { ComposedApplication } from '$lib/api/application';

	export let application: ComposedApplication;
</script>

<a href="/application/{application.id}" target="_blank" class="hover:no-underline">
	<div class="flex items-start gap-4 pl-4 pr-8 py-3 rounded-lg hover:bg-muted/70">
		<div class="-translate-y-0.5 w-fit shrink-0">
			<ApplicationStatusSign {application} iconOnly />
		</div>
		<div class="flex flex-col">
			<h4>
				{#each application.schools as school}
					<p class="text-pretty leading-5 text-primary font-medium">{school.name}</p>
				{/each}
			</h4>
			<div class="inline-flex items-center gap-2 pt-1">
				<p class="text-muted-foreground text-pretty">
					{application.program.display_name}
				</p>
				<Badge variant="outline" class="w-fit h-5 bg-muted text-muted-foreground -translate-x-[1px]"
					>{application.round_name}</Badge
				>
			</div>
		</div>
	</div>
</a>

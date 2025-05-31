<script lang="ts">
	import type { Service } from '$lib/api/contract';
	import UserAvatar from '$lib/components/misc/UserAvatar.svelte';
	import { toShortDate } from '$lib/util/dateUtils';

	export let service: Service;
</script>

<div class="flex items-center gap-8 w-full">
	<a
		class="flex items-center gap-3 group mr-auto hover:no-underline"
		href="/cf/{service.cf_username}"
	>
		<UserAvatar username={service.cf_username} class="size-[36px]" imageClass="size-[24px]" />

		<div class="flex flex-col gap-1">
			<p class="text-primary group-hover:underline">{service.cf_username}</p>
			<div class="flex items-center gap-1.5 text-xs">
				<div class="inline-flex gap-1">
					<span>{service.role}</span>
					{#if service.start_date && service.end_date}
						<span>{toShortDate(service.start_date, service.end_date)}</span>
					{:else if service.start_date}
						<span>starting {toShortDate(service.start_date)}</span>
					{:else if service.end_date}
						<span>until {toShortDate(service.end_date)}</span>
					{/if}
				</div>
			</div>
		</div>
	</a>

	<slot name="actions" />
</div>

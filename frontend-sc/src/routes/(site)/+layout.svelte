<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	import { cn } from '$lib/utils';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Avatar from '$lib/components/ui/avatar/index';
	import Button from '$lib/components/ui/button/button.svelte';
	import User from 'lucide-svelte/icons/user';
	import Bookmark from 'lucide-svelte/icons/bookmark';
	import Settings from 'lucide-svelte/icons/settings';
	import LogOut from 'lucide-svelte/icons/log-out';

	import StudentSideList from '$lib/components/widgets/student-side-list/StudentSideList.svelte';
	import UserDirectory from '$lib/components/widgets/UserDirectory.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { quickAccessYears } from '$lib/util/dateUtils';

	export let data;

	$: isDataGridPage = !!$page.url.pathname.match('/data-grids/(students|applications)');

	$: selectedStudentId = (() => {
		const match = $page.url.pathname.match('/student/(\\d+)$');
		if (match !== null) {
			return parseInt(match[1]);
		}
	})();
</script>

<div class={cn('relative container w-full', isDataGridPage ? 'max-w-full pb-4' : 'pb-0')}>
	<div
		class="fixed top-0 left-0 w-full h-[60px] backdrop-blur bg-white/70 shadow-sm z-40 flex flex-row justify-between items-center px-8"
	>
		<nav class="flex gap-4 my-2 max-w-7xl">
			<Button variant="ghost" href="/home" class="text-black font-medium hover:no-underline"
				>Home</Button
			>

			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<Button variant="ghost" builders={[builder]}>CF People</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content class="w-[800px] translate-x-10">
					<div class="grid grid-cols-2 gap-8 py-4 px-8">
						<div class="flex flex-col gap-2">
							<h3 class="font-medium">文案部</h3>
							<Separator />
							<UserDirectory users={data.cfUsers} department="文案" hrefClass="text-sm" />
						</div>
						<div class="flex flex-col gap-2">
							<h3 class="font-medium">咨询部</h3>
							<Separator />
							<UserDirectory users={data.cfUsers} department="咨询" hrefClass="text-sm" />
						</div>
					</div>
				</DropdownMenu.Content>
			</DropdownMenu.Root>

			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<Button variant="ghost" builders={[builder]}>Students</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content class="min-w-[160px]">
					<DropdownMenu.Group class="p-1 flex flex-col gap-0.5">
						{#each quickAccessYears() as year}
							<DropdownMenu.Sub>
								<DropdownMenu.SubTrigger>{year}</DropdownMenu.SubTrigger>
								<DropdownMenu.SubContent class="min-w-[160px]">
									<DropdownMenu.Item
										href={`/data-grids/students?targetYear=${year}&contractType=UG+Freshman`}
										class="text-inherit hover:no-underline">UG Freshman</DropdownMenu.Item
									>
									<DropdownMenu.Item
										href={`/data-grids/students?targetYear=${year}&contractType=UG+Transfer`}
										class="text-inherit hover:no-underline">UG Transfer</DropdownMenu.Item
									>
									<DropdownMenu.Item
										href={`/data-grids/students?targetYear=${year}&contractType=Graduate`}
										class="text-inherit hover:no-underline">Graduate</DropdownMenu.Item
									>
								</DropdownMenu.SubContent>
							</DropdownMenu.Sub>
						{/each}
						<DropdownMenu.Separator />
						<DropdownMenu.Item
							href="/data-grids/students?contractStatus=In+effect"
							class="text-inherit hover:no-underline">Current Students</DropdownMenu.Item
						>
						<DropdownMenu.Item href="/data-grids/students" class="text-inherit hover:no-underline"
							>All Students</DropdownMenu.Item
						>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>

			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<Button variant="ghost" builders={[builder]}>Applications</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content class="min-w-[180px]">
					<DropdownMenu.Group class="p-1 flex flex-col gap-0.5">
						{#each quickAccessYears() as year}
							<DropdownMenu.Sub>
								<DropdownMenu.SubTrigger>{year}</DropdownMenu.SubTrigger>
								<DropdownMenu.SubContent class="min-w-[180px]">
									<DropdownMenu.Label>Undergraduate</DropdownMenu.Label>
									<DropdownMenu.Item
										href={`/data-grids/applications?year=${year}&applicationType=freshman`}
										class="text-inherit hover:no-underline">Freshman</DropdownMenu.Item
									>
									<DropdownMenu.Item
										href={`/data-grids/applications?year=${year}&applicationType=transfer`}
										class="text-inherit hover:no-underline">Transfer</DropdownMenu.Item
									>
									<DropdownMenu.Separator />
									<DropdownMenu.Label>Graduate</DropdownMenu.Label>
									<DropdownMenu.Item
										href={`/data-grids/applications?year=${year}&applicationType=masters`}
										class="text-inherit hover:no-underline">Master&rsquo;s</DropdownMenu.Item
									>
									<DropdownMenu.Item
										href={`/data-grids/applications?year=${year}&applicationType=doctorate`}
										class="text-inherit hover:no-underline">Doctorate</DropdownMenu.Item
									>
									<DropdownMenu.Separator />
									<DropdownMenu.Label>Other</DropdownMenu.Label>
									<DropdownMenu.Item
										href={`/data-grids/applications?year=${year}&applicationType=other`}
										class="text-inherit hover:no-underline">Non-degree</DropdownMenu.Item
									>
								</DropdownMenu.SubContent>
							</DropdownMenu.Sub>
						{/each}
						<DropdownMenu.Separator />
						<DropdownMenu.Item
							href="/data-grids/applications?status=pending"
							class="text-inherit hover:no-underline">Pending Applications</DropdownMenu.Item
						>
						<DropdownMenu.Item
							href="/data-grids/applications"
							class="text-inherit hover:no-underline">All Applications</DropdownMenu.Item
						>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>

			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<Button variant="ghost" builders={[builder]}>Schools</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content class="min-w-[180px]">
					<DropdownMenu.Group class="p-1 flex flex-col gap-0.5">
						<DropdownMenu.Item
							href="/school/index/#universities"
							class="text-inherit hover:no-underline">Universities</DropdownMenu.Item
						>
						<DropdownMenu.Item
							href="/school/index/#secondary-schools"
							class="text-inherit hover:no-underline">Secondary Schools</DropdownMenu.Item
						>
						<DropdownMenu.Item
							href="/school/index/#other-institutions"
							class="text-inherit hover:no-underline">Other Institutions</DropdownMenu.Item
						>
						<DropdownMenu.Separator />
						<DropdownMenu.Item>Rankings</DropdownMenu.Item>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>

			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<Button variant="ghost" builders={[builder]}>Programs</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content class="min-w-[180px]">
					<DropdownMenu.Group class="p-1 flex flex-col gap-0.5">
						<DropdownMenu.Item
							href="/program/index/#ug-freshman"
							class="text-inherit hover:no-underline">UG Freshman</DropdownMenu.Item
						>
						<DropdownMenu.Item
							href="/program/index/#ug-transfer"
							class="text-inherit hover:no-underline">UG Transfer</DropdownMenu.Item
						>
						<DropdownMenu.Item
							href="/program/index/#masters"
							class="text-inherit hover:no-underline">Master&rsquo;s</DropdownMenu.Item
						>
						<DropdownMenu.Item
							href="/program/index/#doctorate"
							class="text-inherit hover:no-underline">Doctorate</DropdownMenu.Item
						>
						<DropdownMenu.Item
							href="/program/index/#non-degree"
							class="text-inherit hover:no-underline">Non-degree</DropdownMenu.Item
						>
						<DropdownMenu.Separator />
						<DropdownMenu.Item>Program Collections</DropdownMenu.Item>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</nav>

		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild let:builder>
				<Button
					variant="outline"
					size="icon"
					class="flex w-[40px] h-[40px] rounded-full"
					builders={[builder]}><User class="size-5 text-muted-foreground shrink-0" /></Button
				>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content class="min-w-[160px] w-fit -translate-x-6">
				<DropdownMenu.Group class="p-1 flex flex-col gap-0.5">
					<div class="flex items-center gap-2 py-2">
						<Avatar.Root>
							<Avatar.Fallback>
								<span>{data.username.charAt(0)}</span>
							</Avatar.Fallback>
						</Avatar.Root>
						<div class="flex flex-col">
							<DropdownMenu.Label class="p-0">{data.username}</DropdownMenu.Label>
							<div class="text-sm text-muted-foreground pr-4">{data.user.email}</div>
						</div>
					</div>
					<DropdownMenu.Separator />
					<DropdownMenu.Item
						href="/my/bookmarks"
						class="flex items-center text-inherit hover:no-underline"
						><Bookmark class="size-4 mr-2.5" />Bookmarks</DropdownMenu.Item
					>
					<DropdownMenu.Item
						href="/my/account"
						class="flex items-center text-inherit hover:no-underline"
						><Settings class="size-4 mr-2.5" />Settings</DropdownMenu.Item
					>
					<DropdownMenu.Separator />
					<DropdownMenu.Item
						on:click={() => goto('/logout')}
						class="flex items-center text-inherit hover:no-underline"
						><LogOut class="size-4 mr-2.5 translate-x-[1px]" />Log Out</DropdownMenu.Item
					>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>

	<div class="relative mt-[60px] min-h-[calc(100vh-340px)]">
		{#if isDataGridPage}
			<div class="flex flex-col pl-4 pt-6 w-full">
				<slot />
			</div>
		{:else}
			<div class="flex gap-8">
				<aside
					class="sticky top-[60px] left-8 max-w-[240px] min-w-[240px] h-[calc(100vh-60px)] overflow-auto pt-8 pb-8 pl-4 pr-8"
				>
					{#await data.students then students}
						<StudentSideList username={data.username} {students} {selectedStudentId} />
					{/await}
				</aside>
				<div class="flex flex-col w-full pt-6 pb-8">
					<slot />
				</div>
			</div>
		{/if}
	</div>
</div>

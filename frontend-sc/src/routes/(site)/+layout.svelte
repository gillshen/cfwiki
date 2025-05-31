<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	import { cn } from '$lib/utils';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Avatar from '$lib/components/ui/avatar/index';
	import Button from '$lib/components/ui/button/button.svelte';
	import User from 'lucide-svelte/icons/user';
	import Bookmark from 'lucide-svelte/icons/bookmark';
	import KeyRound from 'lucide-svelte/icons/key-round';
	import Settings from 'lucide-svelte/icons/settings';
	import LogOut from 'lucide-svelte/icons/log-out';

	import StudentSideList from '$lib/components/widgets/student-side-list/StudentSideList.svelte';
	import UserMenuDirectory from '$lib/components/widgets/UserMenuDirectory.svelte';
	import { quickAccessYears } from '$lib/util/dateUtils';
	import { Departments } from '$lib/api/user';

	export let data;

	$: studentPgae = !!$page.url.pathname.match(/^[/]student[/]\d+/);
	$: dataGridPage = !!$page.url.pathname.match(/^[/]data-grids[/](students|applications)/);

	$: selectedStudentId = (() => {
		const match = $page.url.pathname.match('^/student/(\\d+)$');
		if (match !== null) {
			return parseInt(match[1]);
		}
	})();
</script>

<div class="relative w-[calc(100vw-10px)]">
	<header class="fixed top-0 left-0 w-[100vw] h-[60px] backdrop-blur-lg z-40 flex">
		<nav
			class={cn(
				'flex items-center gap-6 -translate-x-[5px] px-4 h-full m-auto w-full',
				dataGridPage ? 'pl-6 min-[1500px]:pl-16 min-[1500px]:pr-14' : 'max-w-[1400px]'
			)}
		>
			<Button
				variant="outline"
				href="/home"
				class="text-primary font-medium hover:no-underline mr-6">Home</Button
			>

			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<Button variant="ghost" builders={[builder]}>CF People</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content transitionConfig={{ duration: 200 }}>
					<DropdownMenu.Group class="grid grid-cols-2 items-start">
						{#each Object.values(Departments) as department}
							<div class="grid grid-cols-2 gap-x-4 mx-4 mb-2">
								<DropdownMenu.Label class="col-span-2 px-4 pt-2.5 pb-1.5"
									>{department}部</DropdownMenu.Label
								>
								<DropdownMenu.Separator class="col-span-2 my-1" />
								<UserMenuDirectory
									users={data.cfUsers}
									{department}
									itemClass="px-4 py-1.5 min-w-[100px]"
								/>
							</div>
						{/each}
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>

			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<Button variant="ghost" builders={[builder]}>Institutions</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content class="min-w-[200px]" transitionConfig={{ duration: 200 }}>
					<DropdownMenu.Group class="flex flex-col">
						<DropdownMenu.Label class="px-3 py-1.5">Schools</DropdownMenu.Label>
						<DropdownMenu.Item
							href="/school/index/#universities"
							class="text-inherit hover:no-underline px-3 py-1.5">Universities</DropdownMenu.Item
						>
						<DropdownMenu.Item
							href="/school/index/#secondary-schools"
							class="text-inherit hover:no-underline px-3 py-1.5"
							>Secondary Schools</DropdownMenu.Item
						>
						<DropdownMenu.Item
							href="/school/index/#other-institutions"
							class="text-inherit hover:no-underline px-3 py-1.5"
							>Other Institutions</DropdownMenu.Item
						>
						<DropdownMenu.Separator />
						<DropdownMenu.Item disabled class=" px-3 py-1.5">School Rankings</DropdownMenu.Item>
						<DropdownMenu.Separator />
						<DropdownMenu.Label class=" px-3 py-1.5">Programs</DropdownMenu.Label>
						<DropdownMenu.Item
							href="/program/index/#ug-freshman"
							class="text-inherit hover:no-underline px-3 py-1.5">Undergraduate</DropdownMenu.Item
						>
						<DropdownMenu.Item
							href="/program/index/#masters"
							class="text-inherit hover:no-underline px-3 py-1.5">Graduate</DropdownMenu.Item
						>
						<DropdownMenu.Item
							href="/program/index/#non-degree"
							class="text-inherit hover:no-underline px-3 py-1.5">Non-degree</DropdownMenu.Item
						>
						<DropdownMenu.Separator />
						<DropdownMenu.Item disabled class=" px-3 py-1.5">Program Collections</DropdownMenu.Item>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>

			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<Button variant="ghost" builders={[builder]}>Students</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content class="min-w-[190px]" transitionConfig={{ duration: 150 }}>
					<DropdownMenu.Group class="flex flex-col">
						<DropdownMenu.Item
							href="/data-grids/students?contractStatus=In+effect"
							class="text-inherit hover:no-underline px-3 py-1.5">Current</DropdownMenu.Item
						>
						<DropdownMenu.Separator />
						<DropdownMenu.Sub>
							<DropdownMenu.SubTrigger class="px-3 py-1.5">UG Freshman</DropdownMenu.SubTrigger>
							<DropdownMenu.SubContent class="min-w-[180px]">
								{#each quickAccessYears() as year}
									<DropdownMenu.Item
										href="/data-grids/students?contractType=UG+Freshman&targetYear={year}"
										class="text-inherit hover:no-underline px-3 py-1.5">{year}</DropdownMenu.Item
									>
								{/each}
							</DropdownMenu.SubContent>
						</DropdownMenu.Sub>
						<DropdownMenu.Sub>
							<DropdownMenu.SubTrigger class="px-3 py-1.5">UG Transfer</DropdownMenu.SubTrigger>
							<DropdownMenu.SubContent class="min-w-[180px]">
								{#each quickAccessYears() as year}
									<DropdownMenu.Item
										href="/data-grids/students?contractType=UG+Transfer&targetYear={year}"
										class="text-inherit hover:no-underline px-3 py-1.5">{year}</DropdownMenu.Item
									>
								{/each}
							</DropdownMenu.SubContent>
						</DropdownMenu.Sub>
						<DropdownMenu.Sub>
							<DropdownMenu.SubTrigger class="px-3 py-1.5">Graduate</DropdownMenu.SubTrigger>
							<DropdownMenu.SubContent class="min-w-[180px]">
								{#each quickAccessYears() as year}
									<DropdownMenu.Item
										href="/data-grids/students?contractType=Graduate&targetYear={year}"
										class="text-inherit hover:no-underline px-3 py-1.5">{year}</DropdownMenu.Item
									>
								{/each}
							</DropdownMenu.SubContent>
						</DropdownMenu.Sub>
						<DropdownMenu.Separator />
						<DropdownMenu.Item
							href="/data-grids/students"
							class="text-inherit hover:no-underline px-3 py-1.5">All Students</DropdownMenu.Item
						>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>

			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<Button variant="ghost" builders={[builder]}>Applications</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content class="min-w-[200px]" transitionConfig={{ duration: 200 }}>
					<DropdownMenu.Group class="flex flex-col">
						<DropdownMenu.Item
							href="/data-grids/applications?status=pending"
							class="text-inherit hover:no-underline px-3 py-1.5">In Progress</DropdownMenu.Item
						>
						<DropdownMenu.Separator />
						<DropdownMenu.Label class="px-3 py-1.5">Undergraduate</DropdownMenu.Label>
						<DropdownMenu.Sub>
							<DropdownMenu.SubTrigger class="px-3 py-1.5">Freshman</DropdownMenu.SubTrigger>
							<DropdownMenu.SubContent class="min-w-[180px]">
								{#each quickAccessYears() as year}
									<DropdownMenu.Item
										href="/data-grids/applications?applicationType=freshman&year={year}"
										class="text-inherit hover:no-underline px-3 py-1.5">{year}</DropdownMenu.Item
									>
								{/each}
							</DropdownMenu.SubContent>
						</DropdownMenu.Sub>
						<DropdownMenu.Sub>
							<DropdownMenu.SubTrigger class="px-3 py-1.5">Transfer</DropdownMenu.SubTrigger>
							<DropdownMenu.SubContent class="min-w-[180px]">
								{#each quickAccessYears() as year}
									<DropdownMenu.Item
										href="/data-grids/applications?applicationType=transfer&year={year}"
										class="text-inherit hover:no-underline px-3 py-1.5">{year}</DropdownMenu.Item
									>
								{/each}
							</DropdownMenu.SubContent>
						</DropdownMenu.Sub>
						<DropdownMenu.Label class="px-3 py-1.5">Graduate</DropdownMenu.Label>
						<DropdownMenu.Sub>
							<DropdownMenu.SubTrigger class="px-3 py-1.5">Master&rsquo;s</DropdownMenu.SubTrigger>
							<DropdownMenu.SubContent class="min-w-[180px]">
								{#each quickAccessYears() as year}
									<DropdownMenu.Item
										href="/data-grids/applications?applicationType=masters&year={year}"
										class="text-inherit hover:no-underline px-3 py-1.5">{year}</DropdownMenu.Item
									>
								{/each}
							</DropdownMenu.SubContent>
						</DropdownMenu.Sub>
						<DropdownMenu.Sub>
							<DropdownMenu.SubTrigger class="px-3 py-1.5">Doctorate</DropdownMenu.SubTrigger>
							<DropdownMenu.SubContent class="min-w-[180px]">
								{#each quickAccessYears() as year}
									<DropdownMenu.Item
										href="/data-grids/applications?applicationType=doctorate&year={year}"
										class="text-inherit hover:no-underline px-3 py-1.5">{year}</DropdownMenu.Item
									>
								{/each}
							</DropdownMenu.SubContent>
						</DropdownMenu.Sub>
						<DropdownMenu.Label class="px-3 py-1.5">Other</DropdownMenu.Label>
						<DropdownMenu.Sub>
							<DropdownMenu.SubTrigger class="px-3 py-1.5">Non-degree</DropdownMenu.SubTrigger>
							<DropdownMenu.SubContent class="min-w-[180px]">
								{#each quickAccessYears() as year}
									<DropdownMenu.Item
										href="/data-grids/applications?applicationType=other&year={year}"
										class="text-inherit hover:no-underline px-3 py-1.5">{year}</DropdownMenu.Item
									>
								{/each}
							</DropdownMenu.SubContent>
						</DropdownMenu.Sub>
						<DropdownMenu.Separator />
						<DropdownMenu.Item
							href="/data-grids/applications"
							class="text-inherit hover:no-underline px-3 py-1.5"
							>All Applications</DropdownMenu.Item
						>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>

			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<Button
						variant="outline"
						size="icon"
						class="flex w-[40px] h-[40px] rounded-full ml-auto"
						builders={[builder]}
					>
						<Avatar.Root class="flex bg-primary/5">
							<Avatar.Image
								src={data.user.avatar}
								class="size-7 m-auto"
								alt="{data.username}-avatar"
							/>
							<Avatar.Fallback>
								<User class="size-[22px] text-muted-foreground shrink-0" />
							</Avatar.Fallback>
						</Avatar.Root>
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content class="min-w-[160px] w-fit">
					<DropdownMenu.Group class="flex flex-col">
						<div class="flex flex-col px-3 py-1.5">
							<DropdownMenu.Label class="p-0">{data.username}</DropdownMenu.Label>
							<div class="text-sm text-muted-foreground">{data.user.email}</div>
						</div>
						<DropdownMenu.Separator />
						<DropdownMenu.Item
							href="/my/bookmarks"
							class="flex items-center text-inherit hover:no-underline px-3 py-1.5"
							><Bookmark class="size-4 mr-2.5" />Bookmarks</DropdownMenu.Item
						>
						<DropdownMenu.Separator />
						<DropdownMenu.Item
							href="/my/appearance"
							class="flex items-center text-inherit hover:no-underline px-3 py-1.5"
							><Settings class="size-4 mr-2.5" />Appearance</DropdownMenu.Item
						>
						<DropdownMenu.Item
							href="/my/password"
							class="flex items-center text-inherit hover:no-underline px-3 py-1.5"
							><KeyRound class="size-4 mr-2.5" />Change Password</DropdownMenu.Item
						>
						<DropdownMenu.Separator />
						<DropdownMenu.Item
							on:click={() => goto('/logout')}
							class="flex items-center text-inherit hover:no-underline px-3 py-1.5"
							><LogOut class="size-4 mr-2.5 translate-x-[1px]" />Log Out</DropdownMenu.Item
						>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</nav>
	</header>

	<div
		class={cn(
			'mx-auto mt-[60px] flex flex-col justify-center',
			dataGridPage ? 'w-full' : 'max-w-[1400px]'
		)}
	>
		{#if dataGridPage}
			<article class="flex flex-col w-full pt-4 pl-6 pr-4 min-[1500px]:pl-16 min-[1500px]:pr-14">
				<slot />
			</article>
		{:else}
			<!-- pl-5 instead of pl-4 for better visual alignment with the home button -->
			<aside
				class="fixed top-[60px] w-[240px] h-[calc(100vh-60px)] pr-4 pl-5 py-8 overflow-auto mr-4 overscroll-contained"
			>
				{#await data.students then students}
					<StudentSideList username={data.username} {students} {selectedStudentId} />
				{/await}
			</aside>

			{#if studentPgae}
				<slot />
			{:else}
				<article class="ml-[240px] p-4 pl-8">
					<!-- main body has a max content width of 1112px -->
					<slot />
				</article>
			{/if}
		{/if}
	</div>
</div>

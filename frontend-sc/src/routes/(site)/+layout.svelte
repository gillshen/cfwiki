<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	// import Table2 from 'lucide-svelte/icons/table-2';
	// import Mic from 'lucide-svelte/icons/mic';
	// import TV from 'lucide-svelte/icons/tv';
	// import ClapperBoard from 'lucide-svelte/icons/clapperboard';

	export let data;
</script>

<div class="container w-full mx-auto pb-8 flex-grow-0">
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
				<DropdownMenu.Content>
					<DropdownMenu.Group>
						<DropdownMenu.Label>TODO</DropdownMenu.Label>
						<DropdownMenu.Separator />
						<DropdownMenu.Item>TODO</DropdownMenu.Item>
						<DropdownMenu.Item>TODO</DropdownMenu.Item>
						<DropdownMenu.Item>TODO</DropdownMenu.Item>
						<DropdownMenu.Item>TODO</DropdownMenu.Item>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>

			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<Button variant="ghost" builders={[builder]}>Students</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					<DropdownMenu.Group>
						<DropdownMenu.Label>TODO</DropdownMenu.Label>
						<DropdownMenu.Separator />
						<DropdownMenu.Item>TODO</DropdownMenu.Item>
						<DropdownMenu.Item>TODO</DropdownMenu.Item>
						<DropdownMenu.Item>TODO</DropdownMenu.Item>
						<DropdownMenu.Item>TODO</DropdownMenu.Item>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>

			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<Button variant="ghost" builders={[builder]}>Applications</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					<DropdownMenu.Group>
						<DropdownMenu.Label>TODO</DropdownMenu.Label>
						<DropdownMenu.Separator />
						<DropdownMenu.Item>TODO</DropdownMenu.Item>
						<DropdownMenu.Item>TODO</DropdownMenu.Item>
						<DropdownMenu.Item>TODO</DropdownMenu.Item>
						<DropdownMenu.Item>TODO</DropdownMenu.Item>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>

			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<Button variant="ghost" builders={[builder]}>Schools</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					<DropdownMenu.Group>
						<DropdownMenu.Item>Universities</DropdownMenu.Item>
						<DropdownMenu.Item>Secondary Schools</DropdownMenu.Item>
						<DropdownMenu.Item>Other Institutions</DropdownMenu.Item>
						<DropdownMenu.Separator />
						<DropdownMenu.Item>Rankings</DropdownMenu.Item>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>

			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<Button variant="ghost" builders={[builder]}>Programs</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					<DropdownMenu.Group>
						<DropdownMenu.Item>UG Freshman</DropdownMenu.Item>
						<DropdownMenu.Item>UG Transfer</DropdownMenu.Item>
						<DropdownMenu.Item>Graduate</DropdownMenu.Item>
						<DropdownMenu.Item>Non-degree</DropdownMenu.Item>
						<DropdownMenu.Separator />
						<DropdownMenu.Item>Program Collections</DropdownMenu.Item>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</nav>

		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild let:builder>
				<Button variant="secondary" builders={[builder]}>My Account</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content>
				<DropdownMenu.Group>
					<DropdownMenu.Label>{data.username}</DropdownMenu.Label>
					<DropdownMenu.Separator />
					<DropdownMenu.Item>Settings</DropdownMenu.Item>
					<DropdownMenu.Item href="/logout">Log Out</DropdownMenu.Item>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>

	<div class="mt-[84px] flex flex-col min-h-[calc(100vh-360px)] flex-grow">
		<div class="flex">
			<div class="w-[360px] pr-8 bg-gray-100">
				<slot name="sidebar" />
			</div>
			<div class="flex flex-col pl-8 w-full">
				<slot />
			</div>
		</div>
	</div>
</div>

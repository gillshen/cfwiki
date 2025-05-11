// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
type User = {
	id: number;
	username: string;
	is_active: boolean;
	is_staff: boolean;
	is_superuser: boolean;
};

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: User | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};

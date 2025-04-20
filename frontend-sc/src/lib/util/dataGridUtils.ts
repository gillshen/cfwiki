import { goto } from '$app/navigation';
import type { Page } from '@sveltejs/kit';
import type { Readable } from 'svelte/store';

export class SearchParamsManager {
	constructor(
		private pageStore: Readable<Page>,
		private updateGrid: () => Promise<void>
	) {
		this.pageStore = pageStore;
		this.updateGrid = updateGrid;
	}

	onParamChange(searchParam: string, value?: string) {
		return async () => await this._setSearchParam(searchParam, value);
	}

	onSelectInputChange(searchParam: string) {
		return async (e: Event) => {
			const target = e.target as HTMLSelectElement;
			await this._setSearchParam(searchParam, target.value);
		};
	}

	private async _setSearchParam(searchParam: string, value?: string) {
		const url = new URL(this.currentUrl);
		if (value === 'All' || value === undefined) {
			url.searchParams.delete(searchParam);
		} else {
			url.searchParams.set(searchParam, value);
		}
		await goto(url);
		await this.updateGrid();
	}

	private get currentUrl() {
		let url: URL;
		this.pageStore.subscribe(($page) => {
			url = $page.url;
		})();
		return url!;
	}
}

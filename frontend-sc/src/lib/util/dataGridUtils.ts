import { goto } from '$app/navigation';
import type { Page } from '@sveltejs/kit';
import type { Selected } from 'bits-ui';
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

	onScSelectChange(searchParam: string) {
		return async (selected: Selected<string> | undefined) => {
			if (selected) {
				await this._setSearchParam(searchParam, selected.value);
			}
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

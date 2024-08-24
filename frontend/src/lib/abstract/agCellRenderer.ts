import type { ICellRendererComp, ICellRendererParams } from 'ag-grid-community';
import type { SvelteComponent } from 'svelte';

export class AgCellRenderer implements ICellRendererComp {
	/*
		Usage

	  class <renderer_class_name> extends AgCellRenderer {
	 		declare eGui: HTMLAnchorElement;

			init(params: ICellRendererParams<any, any, any>): void {
				// create the declared element
				this.eGui = document.createElement('a');
				// further process the element
			}
		}
	*/
	eGui!: HTMLElement;

	init(params: ICellRendererParams<any, any, any>): void {
		console.log(params);
	}

	getGui(): HTMLElement {
		return this.eGui;
	}

	refresh(): boolean {
		return false;
	}
}

export class SvelteCellRenderer implements ICellRendererComp {
	/*
		Usage

	  class <renderer_class_name> extends AgCellRenderer {
	 		createComponent(params: ICellRendererParams): void {
			  this.component = new ExampleComponent({
				  target: this.eGui,
					props: { ... } // has access to `params.data`
				})
			}
		}
	*/
	declare eGui: HTMLElement;
	declare component: SvelteComponent;

	init(params: ICellRendererParams) {
		this.eGui = document.createElement('div');
		this.eGui.classList.add('truncate');
		this.createComponent(params);
	}

	createComponent(params: ICellRendererParams): void {
		console.log(params);
	}

	refresh(): boolean {
		return false;
	}
	getGui() {
		return this.eGui;
	}
	destroy() {
		if (this.component) {
			this.component.$destroy();
		}
	}
}

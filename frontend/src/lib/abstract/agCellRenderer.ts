import type { ICellRendererComp, ICellRendererParams } from 'ag-grid-community';

/* Usage

class <renderer_class_name> extends AgCellRenderer {
		declare eGui: HTMLAnchorElement;

		init(params: ICellRendererParams<any, any, any>): void {
      // create the declared element
			this.eGui = document.createElement('a');
			// further process the element
		}
	}
*/

class AgCellRenderer implements ICellRendererComp {
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

export default AgCellRenderer;

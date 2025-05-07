import { IProductItem, IProductList } from '../types';
import { IEvents } from './base/events';



export class ProductList implements IProductList {
	protected _items: IProductItem[];
	protected _preview: string | null;
	protected events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
	}

	set items(items: IProductItem[]) {
		this._items = items;
		this.events.emit('list:changed');
	}

	get items() {
		return this._items;
	}

	getItem(itemId: string): IProductItem {
		return this._items.find((item) => item.id === itemId);
	}

	set preview(itemId: string | null) {
		if (!itemId) {
			this._preview = null;
			return;
		}
		const selectedCard = this.getItem(itemId);
		if (selectedCard) {
			this._preview = itemId;
			this.events.emit('item:select');
		}
	}

	get preview() {
		return this._preview;
	}
	
}
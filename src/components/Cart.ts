import { ICart, IProductItem } from '../types';
import { IEvents } from './base/events';

export class Cart implements ICart {
	protected _items: IProductItem[];
	protected _total: number;
	protected events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
	}

	set items(items: IProductItem[]) {
		this._items = items;
	}

	get items() {
		return this._items;
	}

	set total(total: number) {
		this._total = total;
	}

	get total() {
		return this._total;
	}

	getItemIds(): string[] {
		return this._items.map((item) => item.id);
	}

	addItemToCart(item: IProductItem): void {
		this._items.push(item);
		this.events.emit('cart:changed', this._items);
	}

	removeItemFromCart(itemId: string): void {
		this._items = this._items.filter((item) => item.id !== itemId);
		this.events.emit('cart:changed', this._items);
	}

	countTotal(): number {
		this._total = this._items.reduce((countedTotal, item) => {
			return item.price !== null ? countedTotal + item.price : countedTotal;
		}, 0);
		return this._total;
	}

	proceedToCheckout(): void {
		this.events.emit('cart:checkout', this._items);
	}

	clearCart(): void {
		this._items = [];
		this._total = 0;
	}
}

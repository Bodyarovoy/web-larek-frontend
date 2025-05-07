import { IProductItem } from '../../types';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

export class Card extends Component<IProductItem> {
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _description: HTMLElement;
	protected _price: HTMLElement;
	protected _category: HTMLElement;
	protected _button: HTMLButtonElement;
	protected _id: string;

	constructor(protected container: HTMLElement, protected events: IEvents) {
		super(container);

		this._title = this.container.querySelector('.card__title');
		this._price = this.container.querySelector('.card__price');
	}

	set price(price: number) {
		this._price.textContent = price !== null ? `${price} синапсов` : 'Бесценно';
	}

	set title(title: string) {
		this._title.textContent = title;
	}

	set id(id: string) {
		this._id = id;
	}

	get id(): string {
		return this._id;
	}
}

export class CardCatalog extends Card {
	constructor(protected container: HTMLElement, protected events: IEvents) {
		super(container, events);

		this._image = this.container.querySelector('.card__image');
		this._category = this.container.querySelector('.card__category');

		this.container.addEventListener('click', (event) => {
			if (!(event.target instanceof HTMLElement)) return;
			if (event.target.closest('.button')) return;
			this.events.emit('item:preview', { id: this._id });
		});
	}

	set category(category: string) {
		this._category.textContent = category;
	}

	set image(image: string) {
		this._image.src = image;
	}
}

export class CardPreview extends CardCatalog {
	constructor(protected container: HTMLElement, protected events: IEvents) {
		super(container, events);
		this._description = this.container.querySelector('.card__text');
		this._button = this.container.querySelector('.button');

		if (this._button) {
			this._button.addEventListener('click', () => {
				this.events.emit('inCartButton:click', { id: this._id });
			});
		}
	}

	set description(description: string) {
		this._description.textContent = description;
	}

	setButtonState(inCart: boolean) {
		if (this._button) {
			this._button.textContent = inCart ? 'В корзине' : 'В корзину';
			this.setDisabled(this._button, inCart);
		}
	}
}

export class CardBasket extends Card {
	constructor(protected container: HTMLElement, protected events: IEvents) {
		super(container, events);
		this._button = this.container.querySelector('.basket__item-delete');

		if (this._button) {
			this._button.addEventListener('click', () => {
				this.events.emit('deleteButton:click', { id: this._id });
			});
		}
	}

	render(item: IProductItem, index?: number): HTMLElement {
		this.id = item.id;
		this.title = item.title;
		this.price = item.price;

		const indexEl = this.container.querySelector('.basket__item-index');
		if (indexEl && typeof index === 'number') {
			indexEl.textContent = String(index + 1);
		}

		return this.container;
	}
}

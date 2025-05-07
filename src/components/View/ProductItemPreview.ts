import { IProductItem } from '../../types';

export class ProductItemPreview {
	protected container: HTMLElement;
	protected addItemToCartButton: HTMLButtonElement;
	protected category: HTMLElement;
	protected title: HTMLElement;
	protected description: HTMLElement;
	protected image: HTMLImageElement;
	protected price: HTMLElement;

	constructor(container: HTMLElement) {
		this.container = container;

		this.addItemToCartButton = this.container.querySelector('.button');
		this.category = this.container.querySelector('.card__category');
		this.title = this.container.querySelector('.card__title');
		this.description = this.container.querySelector('.card__text');
		this.image = this.container.querySelector('.card__image');
		this.price = this.container.querySelector('.card__price');
	}

	setData(item: IProductItem): void {
		this.title.textContent = item.title;
		this.description.textContent = item.description;
		this.category.textContent = item.category;
		this.image.src = item.image;
		this.image.alt = item.title;
		this.price.textContent =
			item.price !== null ? `${item.price} синапсов` : 'Бесценно';
			
		this.addItemToCartButton.disabled = item.price === null;
	}

	render(): HTMLElement {
		return this.container;
	}

	
}

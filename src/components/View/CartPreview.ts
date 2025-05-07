import { IEvents } from '../base/events';

export class CartPreview {
	setButtonState(inCart: boolean) {
	}

	protected container: HTMLElement;
	protected totalElement: HTMLElement;
	protected proceedToCheckoutButton: HTMLButtonElement;
	protected listContainer: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		this.container = container;

		this.totalElement = this.container.querySelector('.basket__price');
		this.listContainer = this.container.querySelector('.basket__list');
		this.proceedToCheckoutButton =
			this.container.querySelector('.basket__button');

		this.proceedToCheckoutButton.addEventListener('click', () => {
			this.events.emit('checkoutButton:click');
		});
	}

	setValid(isValid: boolean): void {
		this.proceedToCheckoutButton.disabled = !isValid;
	}

	setCartData(items: HTMLElement[]): void {
		this.listContainer.replaceChildren(...items);
	}

	setTotal(total: number): void {
		this.totalElement.textContent = `${total} синапсов`;
	}

	render(): HTMLElement {
		return this.container;
	}
}

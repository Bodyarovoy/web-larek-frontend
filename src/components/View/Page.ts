import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';


//  Интерфейс описывающий начальную странцу

interface IPage {

	counter: number;

	locked: boolean;
}


// Класс, описывающий начальную страницу с товарами

export class Page extends Component<IPage> {
	// Ссылки на внутренние элементы
	protected _counter: HTMLElement;
	protected _store: HTMLElement;
	protected _wrapper: HTMLElement;
	protected _basket: HTMLElement;

	// Конструктор принимает родительский элемент и обработчик событий
	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._counter = ensureElement<HTMLElement>('.header__basket-counter');
		this._store = ensureElement<HTMLElement>('.gallery');
		this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
		this._basket = ensureElement<HTMLElement>('.header__basket');

		this._basket.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
	}

	// Сеттер для счётчика товаров в корзине
	set counter(value: number) {
		this.setText(this._counter, String(value));
	}

	// Сеттер для блока прокрутки
	set locked(value: boolean) {
		if (value) {
			this._wrapper.classList.add('page__wrapper_locked');
		} else {
			this._wrapper.classList.remove('page__wrapper_locked');
		}
	}
}

import { ProductItem } from '../components/AppData';

export interface IProductItem {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

export interface IProductList {
	items: IProductItem[];
	preview: string | null;

	getItem(itemId: string): IProductItem;
}

export interface IForm {
	payment: string;
	address: string;
	email: string;
	phone: string;

	choosePaymentOption(option: string): void;
	checkCheckoutValidation(data: Record<keyof TCheckoutModal, string>): boolean;
	checkContactsValidation(data: Record<keyof TContactsModal, string>): boolean;
	sendOrderToServer(
		items: IProductItem[],
		total: number
	): { id: string; total: number };
}

export interface ICart {
	items: IProductItem[];
	total: number;

	addItemToCart(item: IProductItem): void;
	removeItemFromCart(itemId: string, payload: Function | null): void;
	countTotal(): number;
	proceedToCheckout(): void;
	clearCart(): void;
}

export type TOrder = Pick<IForm, 'payment' | 'email' | 'phone' | 'address'> &
	Pick<ICart, 'total'> & { items: string[] };

export type TOrderForm = Pick<IForm, 'payment' | 'email' | 'phone' | 'address'>;

export type TCheckoutModal = Pick<IForm, 'payment' | 'address'>;

export type TContactsModal = Pick<IForm, 'email' | 'phone'>;

export type TSuccessPurchaseModal = Pick<ICart, 'total'>;

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
	baseUrl: string;
	get<T>(uri: string): Promise<T>;
	post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export type FormErrors = Partial<Record<keyof TOrder, string>>;

export interface IAppState {
	// Корзина с товарами
	basket: ProductItem[];
	// Массив карточек товара
	store: ProductItem[];
	// Информация о заказе при покупке товара
	order: TOrder;
	// Ошибки при заполнении форм
	formErrors: FormErrors;
	// Метод для добавления товара в корзину
	addToBasket(value: ProductItem): void;
	// Метод для удаления товара из корзины
	deleteFromBasket(id: string): void;
	// Метод для полной очистки корзины
	clearBasket(): void;
	// Метод для получения количества товаров в корзине
	getBasketAmount(): number;
	// Метод для получения суммы цены всех товаров в корзине
	getTotalBasketPrice(): number;
	// Метод для добавления ID товаров в корзине в поле items для order
	setItems(): void;
	// Метод для заполнения полей email, phone, address, payment в order
	setOrderField(field: keyof TOrder, value: string): void;
	// Валидация форм для окошка "контакты"
	validateContacts(): boolean;
	// Валидация форм для окошка "заказ"
	validateOrder(): boolean;
	// Очистить order после покупки товаров
	refreshOrder(): boolean;
	// Метод для превращения данных, полученых с сервера в тип данных приложения
	setStore(items: IProductItem[]): void;
	// Метод для обновления поля selected во всех товарах после совершения покупки
	resetSelected(): void;
}

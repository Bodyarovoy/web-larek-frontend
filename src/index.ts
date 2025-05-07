import { AppApi } from './components/AppApi';
import { AppState } from './components/AppData';
import { ApiListResponse } from './components/base/api';
import { EventEmitter } from './components/base/events';
// import { CardBasket, CardCatalog, CardPreview } from './components/View/Card';
import { Cart } from './components/Cart';
import { CartPreview } from './components/View/CartPreview';
import { Modal } from './components/common/Modal';
import {
	ContactsPreview,
	IContactsPreview,
} from './components/View/ContactsPreview';
import { Page } from './components/View/Page';
import { ProductList } from './components/ProductList';
import { Success } from './components/View/SuccessPurchasePreview';
import './scss/styles.scss';
import { TOrderForm } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { CheckoutPreview } from './components/View/CheckoutPreview';
import { CardBasket, CardCatalog, CardPreview } from './components/View/Card';

const api = new AppApi(CDN_URL, API_URL);
const events = new EventEmitter();
const appData = new AppState({}, events);

const itemsContainer = document.querySelector('.gallery') as HTMLElement;
const modalContainer = ensureElement<HTMLTemplateElement>('#modal-container');

const templateCardCatalog = ensureElement<HTMLTemplateElement>('#card-catalog');
const templateCardPreview = ensureElement<HTMLTemplateElement>('#card-preview');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const cart = new Cart(events);
const productList = new ProductList(events);
const page = new Page(document.body, events);

const modal = new Modal(modalContainer, events);
// const cardPreview = new CheckoutPreview(
// 	'checkoutPreview',
// 	cloneTemplate(orderTemplate),
// 	events
// );
const checkoutPreview = new CheckoutPreview(
	'checkoutPreview',
	cloneTemplate(orderTemplate),
	events
);
const contactsPreview = new ContactsPreview(
	cloneTemplate(contactsTemplate),
	events
);
const successPreview = new Success(
	'successPreview',
	cloneTemplate(successTemplate),
	{
		onClick: () => {
			events.emit('modal:close');
			modal.close();
		},
	}
);

events.onAll(console.log)

// Запрос к api для получения скиска карточек
api
	.getProductList()
	.then((data) => {
		productList.items = data;
		events.emit(`initialData: loaded`);
	})
	.catch((error) => {
		console.log('Ошибка при загрузке товаров:', error);
	});

// Загрузаем список карточек
events.on(`initialData: loaded`, () => {
	const itemsArray = productList.items.map((item) => {
		const itemsInstant = new CardCatalog(
			cloneTemplate(templateCardCatalog),
			events
		);
		return itemsInstant.render(item);
	});
	itemsContainer.replaceChildren(...itemsArray);
	cart.items = [];
});

// Событие при закрытии модального окна
events.on(`modal:close`, () => {
	page.locked = false;
});

// Функция обновления корзины
function updateCartPreview() {
	const cartItems = cart.items;

	const itemElements = cartItems.map((item, index) => {
		const template = document.querySelector(
			'#card-basket'
		) as HTMLTemplateElement;
		const element = template.content.firstElementChild.cloneNode(
			true
		) as HTMLElement;
		const card = new CardBasket(element, events);
		return card.render(item, index);
	});

	const cartTemplate = document.querySelector('#basket') as HTMLTemplateElement;
	const cartContainer = cartTemplate.content.firstElementChild.cloneNode(
		true
	) as HTMLElement;
	const cartPreview = new CartPreview(cartContainer, events);

	cartPreview.setCartData(itemElements);
	cartPreview.setTotal(cart.countTotal());
	cartPreview.setValid(
		cartItems.length > 0 && cartItems.every((item) => item.price !== null)
	);
	page.counter = cart.items.length;
	modal.content = cartPreview.render();
}

// Событие при изменении количества товаров в корзине
events.on('cart:changed', updateCartPreview);

// Событие при открытии карточки товара
events.on('item:preview', (data: { id: string }) => {
	page.locked = true;
	const item = productList.getItem(data.id);

	const cardPreviewElement =
		templateCardPreview.content.firstElementChild.cloneNode(
			true
		) as HTMLElement;
	const card = new CardPreview(cardPreviewElement, events);

	// Проверка: есть ли товар в корзине
	const inCart = cart.items.some((cartItem) => cartItem.id === item.id);
	card.setButtonState(inCart);

	modal.content = card.render(item);
	modal.open();
});

// Событие при добавлении товара в корзину
events.on(`inCartButton:click`, (data: { id: string }) => {
	const item = productList.getItem(data.id);
	cart.addItemToCart(item);
	modal.close();
});

// Событие при открытии корзины
events.on('basket:open', () => {
	page.locked = true;
	updateCartPreview();
	modal.open();
});

// Событие при удалении товара из корзины
events.on('deleteButton:click', (data: { id: string }) => {
	cart.removeItemFromCart(data.id, () => {
		events.emit('cart:changed');
	});
});

//Событие при нажатии кнопки Оформить в корзине
events.on('checkoutButton:click', () => {
	appData.order.total = cart.countTotal();
	appData.order.items = cart.getItemIds();
	modal.render({
		content: checkoutPreview.render({
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

// Событие при изменении введённых данных
events.on(
	'checkoutInput:change',
	(data: { field: keyof TOrderForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

// Событие при изменении валидации заказа
events.on('orderFormErrors:change', (errors: Partial<TOrderForm>) => {
	const { payment, address } = errors;
	checkoutPreview.valid = !payment && !address;
	checkoutPreview.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
});

// Событие при нажатии кнопки Далее в окне с заказом
events.on(`order:submit`, () => {
	modal.render({
		content: contactsPreview.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
});

// Событие при изменении валидации контактов
events.on('contactsFormErrors:change', (errors: Partial<IContactsPreview>) => {
	const { phone, email } = errors;
	contactsPreview.valid = !phone && !email;
	contactsPreview.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

// Очистка данных, полей ввода и счётчика корзины при нажатии кнопки Оплатить в окне с контактными данными
events.on('contacts:submit', () => {
	api
		.postOrder(appData.order)
		.then((res) => {
			events.emit('order:success', res);
			cart.clearCart();
			appData.refreshOrder();
			contactsPreview.clear();
			checkoutPreview.clear();
			checkoutPreview.disableButtons();
			page.counter = 0;
		})
		.catch((err) => {
			console.log(err);
		});
});

// Переход на страницу с информацией об успешном заказе при нажатии кнопки Оплатить в окне с контактными данными
events.on('order:success', (res: ApiListResponse<string>) => {
	modal.render({
		content: successPreview.render({
			description: res.total,
		}),
	});
});

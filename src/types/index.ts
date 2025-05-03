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
    paymentOption: string;
    shippingAddress: string;
    email: string;
    phone: string;
    total: number;

    choosePaymentOption(option: string): void;
    checkCheckoutValidation(data: Record<keyof TCheckoutModal, string>): boolean;
    checkContactsValidation(data: Record<keyof TContactsModal, string>): boolean;
    sendOrderToServer(items: IProductItem[], total: number): {id: string, total: number};
}

export interface ICart {
    items: IProductItem[];
    total: number;

    addItemToCart(item: IProductItem): void;
    removeItemFromCart(itemId: string, payload: Function | null ): void;
    countTotal(): number;
    proceedToCheckout(): void;
    clearCart(): void;
}

export type TCheckoutModal = Pick<IForm, 'paymentOption' | 'shippingAddress'>;

export type TContactsModal = Pick<IForm, 'email' | 'phone'>;

export type TSuccessPurchaseModal = Pick<IForm, 'total'>;



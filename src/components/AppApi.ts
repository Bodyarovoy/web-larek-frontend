import { IProductItem, TOrder } from '../types';
import { Api, ApiListResponse } from './base/api';

export interface IAppApi {
	getProductList: () => Promise<IProductItem[]>;
	getProductItem: (id: string) => Promise<IProductItem>;
	postOrder: (data: TOrder) => Promise<{ id: string; total: number }>;
}

export class AppApi extends Api implements IAppApi {
	protected cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getProductList(): Promise<IProductItem[]> {
		return this.get('/product').then((data: ApiListResponse<IProductItem>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image.replace('.svg', '.png'),
			}))
			
		);
	}
	getProductItem(id: string): Promise<IProductItem> {
		return this.get<IProductItem>(`/product/${id}`).then(
			(item: IProductItem) => ({
				...item,
				image: this.cdn + item.image,
			})
		);
	}

	postOrder(data: TOrder): Promise<{ id: string; total: number }> {
		return this.post<{ id: string; total: number }>('/order', data).then(
			(order) => order
		);
	}
}


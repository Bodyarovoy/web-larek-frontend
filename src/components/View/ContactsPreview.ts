import { IEvents } from '../base/events';
import { Form } from '../common/Form';


// Интерфейс, описывающий окошко контакты

export interface IContactsPreview {
	phone: string;

	email: string;
}

export class ContactsPreview extends Form<IContactsPreview> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}
}

import { Subject } from 'rxjs';

const subject = new Subject();

export const paymentService = {
    paymentInitiated: payload => subject.next({ 
        event: 'PAYMENT_INITIATED',
        payload: payload 
    }),
    paymentProcessed: (payload) => subject.next({ 
        event: 'PAYMENT_PROCESSED',
        payload: payload 
    }),
    getService: () => subject.asObservable()
};
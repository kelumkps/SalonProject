import { Subject } from 'rxjs';

const subject = new Subject();

export const notificationService = {
    notifySuccess: message => subject.next({ variant : 'success', message: message }),
    notifyError: message => subject.next({ variant : 'danger', message: message }),
    clearNotifications: () => subject.next(),
    getNotifier: () => subject.asObservable()
};
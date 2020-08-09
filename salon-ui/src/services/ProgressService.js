import { Subject } from 'rxjs';

const subject = new Subject();

export const progressService = {
    setCurrentProgress: progress => subject.next({ now: progress }),
    clearProgress: () => subject.next(),
    getProgress: () => subject.asObservable()
};
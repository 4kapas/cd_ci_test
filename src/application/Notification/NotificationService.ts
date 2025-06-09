import {toast} from 'react-toastify';
import { NotiState } from '@/types/notification.type';

export interface NotificationService {
    notify(message:string, state:NotiState ):void;
}

export const NotificationServiceImpl : NotificationService = {
    notify: async (message,state) => {
        try{
            if(state === NotiState.error){
                toast.error(message);
            }
            else if(state === NotiState.success){
                toast.success(message);
            }
            else {
                toast(message);
            }
        }
        catch(e){
            console.error(e);
            throw e;
        }
    }
}

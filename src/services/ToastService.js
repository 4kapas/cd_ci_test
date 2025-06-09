import { toast } from 'react-toastify';

export class ToastService {
    constructor() {
        this.defaultSetting = {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        }
    }

    /**
     * 
     * @param {*} data msg, callBack은 닫을때 실행되게 설정되어있음
     * ex) msg : "에러메시지", callBack : function()
     */
    static error = (data) => {
        const msg = data?.msg;
        const callBack = data?.callBack;
        toast.error(msg, {
            ...this.defaultSetting,
            onClose: () => {
                if (!callBack) return;
                callBack();
            }
        });
    }

    /**
     * 
     * @param {*} data msg, callBack들이 들어감 
     * 현재 callBack는 할당이되진않음
     * ex) msg : "성공메시지", callBack : function()
     */
    static success = (data) => {
        const msg = data?.msg;
        const callBack = data?.callBack;
        toast.success(msg, {
            ...this.defaultSetting,
        });
    }
}
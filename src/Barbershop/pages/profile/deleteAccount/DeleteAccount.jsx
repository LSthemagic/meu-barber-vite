import axios from "axios";
import Toast from "../../../../shared/custom/Toast";
import path_url from "../../../../shared/config/path_url.json"

export const DeleteAccount = async (id) => {
    let response = null;
    try {
        const res = await axios.delete(`
            ${path_url.remote}/deleteAccount/delBarbershop`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    id: id
                }
            }
        );
        Toast.fire({
            icon: res.data.error ? 'error' : 'success',
            title: res.data.message
        })
        return !res.data.error
    } catch (e) {
        console.log(e)
        Toast.fire({
            icon: 'error',
            title: 'Error deleting account'
        })
    }
}
import axios from "axios";
import Toast from "../../../../shared/custom/Toast";
import path_url from "../../../../shared/config/path_url.json"

export const deleteDependencies = async (props) => {

    console.log(props)
    try {

        const response = await axios.delete(`${path_url.remote}/deleteDependenciesBarbershop/${props.type}`, {

            headers: {
                id: props.id,
                item_id: props.item_id,
            }

        });

        Toast.fire({
            icon: response.data.error ? 'error' : 'success',
            title: response.data.message
        })

        return !response.data.error

    } catch (e) {
        console.log(e)
        Toast.fire({
            icon: 'error',
            title: 'Erro ao remover barbeiro.'
        })
    }
}
import axios from "axios";
import {endpointUrl} from "../Common";
import {useQuery} from "react-query";

const fetchParameterData = (parameterName) => {
    console.log('parm select called: ' + parameterName)
    return axios.get(
    endpointUrl() + "/parm/select/" + parameterName,
        {
            timeout: 0,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        }
    ).then(response => response.data)
}

const catchError = (error) => {
    if (error.response) {
        if (error.response.status === 404) {

        }
    }
    //handleError(error, 'fetchParameterData', true)
}

export default function useFetchParameter (parameterName) {
    console.log(parameterName)
    return useQuery(['parameter', parameterName], () => fetchParameterData(parameterName), {onError: catchError})
}
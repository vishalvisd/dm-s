import _ from 'lodash';

const baseUrl = "http://localhost:8080/api/v1";

const handleServerResponse = async (serverResposne) => {
    return await serverResposne.json().then(res => {
        if (res.error) {
            return {
                success: false,
                errorMessage: `${res.error}`
            }
        }
        return {
            success: true,
            data: res?.data
        }
    }).catch(e => {
        console.error(e);
        return {
            success: false,
            errorMessage: `Unexpected Error`
        }
    })

}
export const makePostRequest = async (path, data) => {
    const rawResponse = await fetch(`${baseUrl}/${path}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return handleServerResponse(rawResponse);
}

const makeQueryString = (queryObject) => {
    let queryString = '';
    if (!_.isEmpty(queryObject)) {
        queryString += '?';
        _.forOwn(queryObject, (v, k) => {
            queryString += `${k}=${v}`;
        })
    }
    return queryString;
}
export const makeGetRequest = async (path, queryObj) => {
    const rawResponse = await fetch(`${baseUrl}/${path}${makeQueryString(queryObj)}`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
    return handleServerResponse(rawResponse);
}
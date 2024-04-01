import _ from 'lodash';
import {makePostRequest} from "./makeRequest.js";

function formatDataForRequest(uiData){
    const {firstname, lastname, email, phone, education} = uiData;
    return {
        first_name: firstname,
        last_name: lastname,
        email,
        phone: _.toNumber(phone),
        education: _.reduce(education, (acc, v)=>{
            const {institution, passoutyear, score} = v;
            acc.push({
                institute: institution,
                passoutyear,
                score
            });
            return acc;
        }, [])
    }
}

export default async function (uiData){
    const dataToSubmit = formatDataForRequest(uiData);
    return makePostRequest('student', dataToSubmit);
}
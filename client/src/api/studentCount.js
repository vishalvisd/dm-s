import _ from 'lodash';
import {makeGetRequest} from './makeRequest.js';

export default async function (){
    return await makeGetRequest('count');
}
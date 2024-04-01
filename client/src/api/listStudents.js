import _ from 'lodash';
import {makeGetRequest} from './makeRequest.js';

export default async function ({page}){
    const res = await makeGetRequest('student', {page});

    if (res.success){
        // Format Server Data to UI data
        const uiData = [];
        const fields = _.get(res, "data.Fields");

        res.data = _.reduce(_.get(res, "data.Values"), (acc, v)=>{
            const toPush = {};
            _.forEach(fields, (field, index) => {
                if (field === "education"){
                    toPush[field] = [];
                    const educations = _.split(v[index], "||")
                    _.forEach(educations, education => {
                        const [institute, passOutYear, score] = _.split(education, ",");
                        toPush[field].push({
                            institute,
                            passOutYear,
                            score
                        })
                    });
                } else {
                    toPush[field] = v[index];
                }
            })
            acc.push(toPush);
            return acc;
        }, []);
    }

    return res;
}
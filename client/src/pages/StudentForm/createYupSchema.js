import _ from "lodash";
import * as yup from "yup";

const declarativeSchemaAttributeHanlder = {
    type: function (yupSchemaObj) {
        if (this.schema) {
            return yupSchemaObj.array().of(createYupSchema(this.schema));
        } else if (this.conditions){
            const type = this.conditions.type;
            return type === 'email'
                ? yupSchemaObj.string().email("Please check E-mail format")
                : yupSchemaObj[type]().typeError("")
        }
    },
    required: function (yupSchemaObj) {
        if (this.conditions.required){
            return yupSchemaObj.required('Mandatory Field');
        }
        return yupSchemaObj.notRequired('');
    },
    min: function (yupSchemaObj) {
        return yupSchemaObj.min(this.conditions.min, `Cannot be less than ${this.conditions.max}`);
    },
    max: function (yupSchemaObj) {
        return yupSchemaObj.max(this.conditions.max, `Cannot be more than ${this.conditions.max}`);
    },
    customValidation: function (yupSchemaObj) {
        return yupSchemaObj.test('Valid', 'Invalid', this.conditions.customValidation)
    }
}

const createYupFieldSchema = (fieldSchema) => {
    let yupObject = declarativeSchemaAttributeHanlder['type'].call(fieldSchema, yup);
    for (const condition in fieldSchema.conditions) {
        if (declarativeSchemaAttributeHanlder[condition] && condition !== "type") {
            yupObject = declarativeSchemaAttributeHanlder[condition].call(fieldSchema, yupObject)
        }
    }
    return yupObject;
}

const createYupSchema = (declarativeSchema) => {
    const shapeObject = {};
    _.forOwn(declarativeSchema, (v, k)=>{
        shapeObject[k] = createYupFieldSchema(v);
    });
    return yup.object().shape(shapeObject)
}

export default (declarativeSchema) => {
    return createYupSchema(declarativeSchema);
}

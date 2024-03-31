import React, {useEffect, useState} from "react";
import _ from "lodash";
import {useForm, useFieldArray} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {DevTool} from '@hookform/devtools';
import {TextField, Button, Stack} from "@mui/material";
import {declarativeSchema, FIELD_NAMES} from "./studentFormSchema.js";
import createYupSchema from "./createYupSchema.js";
import "./styles.css";

let schema = createYupSchema(declarativeSchema);

const {FIRST_NAME, LAST_NAME, EMAIL, PHONE, EDUCATION, INSTITUTION, PASS_OUT_YEAR, SCORE} = FIELD_NAMES;

function StudentForm() {
    const {register, handleSubmit, formState, control} = useForm({
        resolver: yupResolver(schema),
        mode: "onTouched"
    })

    const {fields: educationFields, append: appendEducation} = useFieldArray({
        name: EDUCATION.ID,
        control
    });

    const {errors} = formState;

    const onSubmit = (data) => {
        console.log(data);
    };

    const handleAddEducation = () => {
        appendEducation({
            institution: "",
            passOutYear: "",
            score: ""
        })
    }
    return (
        <>
            <form noValidate onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={2} width={400}>
                    <TextField
                        id={FIRST_NAME.ID}
                        label={FIRST_NAME.LABEL}
                        variant="standard"
                        {...register(FIRST_NAME.ID)}
                        error={!!_.get(errors, `${FIRST_NAME.ID}`)}
                        helperText={_.get(errors, `${FIRST_NAME.ID}.message`)}
                    />
                    <TextField
                        id={LAST_NAME.ID}
                        label={LAST_NAME.LABEL}
                        variant="standard"
                        {...register(LAST_NAME.ID)}
                        error={!!_.get(errors, `${LAST_NAME.ID}`)}
                        helperText={_.get(errors, `${LAST_NAME.ID}.message`)}
                    />
                    <TextField
                        id={EMAIL.ID}
                        label={EMAIL.LABEL}
                        variant="standard"
                        {...register(EMAIL.ID)}
                        error={!!_.get(errors, `${EMAIL.ID}`)}
                        helperText={_.get(errors, `${EMAIL.ID}.message`)}
                    />
                    <TextField
                        id={PHONE.ID}
                        label={PHONE.LABEL}
                        variant="standard"
                        {...register(PHONE.ID)}
                        error={!!_.get(errors, `${PHONE.ID}`)}
                        helperText={_.get(errors, `${PHONE.ID}.message`)}
                    />
                </Stack>
                <div>Education:</div>
                <div>{
                    _.map(educationFields, (field, index) => {
                        return <div key={field.id}>
                            <Stack spacing={2} width={400}>
                                <TextField
                                    id={`${INSTITUTION.ID}${field.id}`}
                                    label={`${INSTITUTION.LABEL}`}
                                    variant="standard"
                                    {...register(`${EDUCATION.ID}.${index}.${INSTITUTION.ID}`)}
                                    error={!!_.get(errors, `${EDUCATION.ID}.${index}.${INSTITUTION.ID}`)}
                                    helperText={_.get(errors, `${EDUCATION.ID}.${index}.${INSTITUTION.ID}.message`)}
                                />
                                <TextField
                                    id={`${PASS_OUT_YEAR.ID}${field.id}`}
                                    label={`${PASS_OUT_YEAR.LABEL}`}
                                    variant="standard"
                                    {...register(`${EDUCATION.ID}.${index}.${PASS_OUT_YEAR.ID}`)}
                                    error={!!_.get(errors, `${EDUCATION.ID}.${index}.${PASS_OUT_YEAR.ID}`)}
                                    helperText={_.get(errors, `${EDUCATION.ID}.${index}.${PASS_OUT_YEAR.ID}.message`)}
                                />
                                <TextField
                                    id={`${SCORE.ID}${field.id}`}
                                    label={`${SCORE.LABEL}`}
                                    variant="standard"
                                    {...register(`${EDUCATION.ID}.${index}.${SCORE.ID}`)}
                                    error={!!_.get(errors, `${EDUCATION.ID}.${index}.${SCORE.ID}`)}
                                    helperText={_.get(errors, `${EDUCATION.ID}.${index}.${SCORE.ID}.message`)}
                                />
                            </Stack>
                        </div>
                    })
                }</div>
                <Button variant="contained" color="secondary" onClick={handleAddEducation}>Add Education</Button>
                <Button type="submit" variant="contained" color="primary">Submit</Button>
            </form>
            <DevTool control={control}/>
        </>
    );
}

export default StudentForm;
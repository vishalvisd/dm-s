import React, {useEffect, useState} from "react";
import {useNavigate} from 'react-router-dom';
import _ from "lodash";
import { styled } from '@mui/material/styles';
import {useForm, useFieldArray} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {DevTool} from '@hookform/devtools';
import {TextField, Button, Stack, Box, Paper, Grid, CircularProgress,
    Snackbar, Alert
} from "@mui/material";
import {declarativeSchema, FIELD_NAMES} from "./studentFormSchema.js";
import createYupSchema from "./createYupSchema.js";
import postData from "../../api/addStudent.js";
import "./styles.css";

let schema = createYupSchema(declarativeSchema);
const STACK_WIDTH = 800;
const {FIRST_NAME, LAST_NAME, EMAIL, PHONE, EDUCATION, INSTITUTION, PASS_OUT_YEAR, SCORE} = FIELD_NAMES;
const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    width: '100%',
    paddingBottom: "50px"
}));

function StudentForm() {
    const navigate = useNavigate();
    const [formSubmitting, setFormSubmitting] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [isSaveError, setIsSaveError] = useState(false);
    const {register, handleSubmit, formState, control, reset} = useForm({
        defaultValues: {
          [EDUCATION.ID]: [{
              [INSTITUTION.ID]: "",
              [PASS_OUT_YEAR.ID]: "",
              [SCORE.ID]: ""
          }]
        },
        resolver: yupResolver(schema),
    })

    const {fields: educationFields, append: appendEducation} = useFieldArray({
        name: EDUCATION.ID,
        control
    });

    const {errors} = formState;

    const onSubmit = async(data) => {
        setFormSubmitting(true)
        const res = await postData(data).catch((e)=>{
            console.log(e);
        })
        if(res && res.success) {
            reset();
            setNotificationMessage("Submitted Successfully");
            setIsSaveError(false);
        } else {
            setNotificationMessage(`Submission Failed ${res.errorMessage}`);
            setIsSaveError(true);
        }
        setShowNotification(true);
        setFormSubmitting(false);
    };

    const handleCloseSuccessMessage = () => {
        setShowNotification(false);
    }
    const handleAddEducation = () => {
        appendEducation({
            institution: "",
            passOutYear: "",
            score: ""
        })
    }
    return (
        <>
            <Button
                sx={{position: "fixed", margin: "10px", top:"5px", right: "5px"}}
                variant="contained"
                onClick={()=>{
                    navigate("/all")
                }}
            >View All
            </Button>
            <form noValidate onSubmit={handleSubmit(onSubmit)}>
                <fieldset style={{border: "0px"}} disabled={formSubmitting}>
                    <Box sx={{flexGrow: 1}}>
                        <Grid container width={STACK_WIDTH + 40} spacing={5}>
                            <Grid item xs={12}>
                                <Box>
                                    Basic Details
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Item>
                                    <Stack width={STACK_WIDTH} spacing={5}>
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
                                </Item>
                            </Grid>
                            <Grid item xs={12}>
                                <Box>
                                    Education
                                </Box>
                            </Grid>
                            <>{
                                _.map(educationFields, (field, index) => {
                                    return <Grid item xs={12} key={field.id}>
                                        <Item>
                                            <Stack width={STACK_WIDTH} spacing={5}>
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
                                        </Item>
                                    </Grid>
                                })
                            }</>
                            <Grid item xs={12}>
                                <Grid item sx={{float: "left"}} xs={6}>
                                    <Button variant="contained" color="secondary" onClick={handleAddEducation}>Add
                                        Education</Button>
                                </Grid>

                                <Grid item sx={{float: "right"}} xs={6}>
                                    <Box sx={{m: 1, position: 'relative'}}>
                                        <Button
                                            variant="contained"
                                            type="submit"
                                            disabled={formSubmitting}
                                        >
                                            Submit
                                        </Button>
                                        {formSubmitting && (
                                            <CircularProgress
                                                size={24}
                                                sx={{
                                                    position: 'absolute',
                                                    top: '50%',
                                                    left: '50%',
                                                    marginTop: '-12px',
                                                    marginLeft: '-12px',
                                                }}
                                            />
                                        )}
                                    </Box>
                                </Grid>
                            </Grid>

                        </Grid>

                    </Box>
                </fieldset>
            </form>
            <Snackbar
                open={showNotification}
                autoHideDuration={3000}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                onClose={handleCloseSuccessMessage}>
                <Alert
                    severity={isSaveError ? "warning" : "success"}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {notificationMessage}
                </Alert>
            </Snackbar>
        </>
    );
}

export default StudentForm;
import _ from 'lodash';
import {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {Box, Button, Chip, Pagination, Paper, Stack} from '@mui/material';
import listStudents from "../../api/listStudents.js";
import studentCount from "../../api/studentCount.js";

export default function ControlledAccordions() {
    const navigate = useNavigate();
    const [expanded, setExpanded] = useState(false);
    const [studentsData, setStudentsData] = useState([]);
    const [totalRecords, setTotalRecords] = useState(1);
    const [page, setPage] = useState(0);

    useEffect(() => {
        listStudents({page}).then(res => {
            if (res && res.success) {
                setStudentsData(res.data);
            }
        })
    }, [page]);

    useEffect(() => {
        studentCount().then(res => {
            if (res && res.success) {
                setTotalRecords(res.data);
            }
        })
    }, [])

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const handlePaginationClick = (e, page) => {
        setExpanded(false);
        setPage(page);
    }

    return (
        <>
            <Stack sx={{height: "100vh", paddingTop: "0px", marginTop: "0px"}}>
                <Paper sx={{width: 1200, paddingTop: "0px", marginTop: "0px"}}>
                    <Stack spacing={5}>

                        <Accordion expanded={false}>
                            <AccordionSummary>
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        navigate("/")
                                    }}
                                >Add Student
                                </Button>
                            </AccordionSummary>

                        </Accordion>
                        <Box>
                            {
                                studentsData && _.map(studentsData, (studentData, i) => {
                                    const {first_name, last_name, email, phone, education} = studentData || {};
                                    return <Accordion
                                        key={`${phone}.${i}`}
                                        expanded={expanded === `panel${i}`}
                                        onChange={handleChange(`panel${i}`)}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon/>}
                                            aria-controls={`panel${i}bh-content`}
                                            id={`panel${i}bh-header`}
                                        >
                                            <Box sx={{width: '100%'}}>
                                                <Box sx={{float: "right"}}>Education</Box>
                                                <Box sx={{float: "left"}}>
                                                    <div style={{display: 'flex', flexDirection: "row", gap: "10px"}}>
                                                        <Typography sx={{color: 'text.primary'}}>
                                                            {first_name} {last_name}
                                                        </Typography>
                                                        <Typography sx={{color: 'text.secondary'}}>
                                                            {phone} {email}
                                                        </Typography>
                                                    </div>
                                                </Box>
                                            </Box>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <div style={{display: 'flex', flexDirection: "row", gap: "10px"}}>
                                                {
                                                    _.map(education, (edu, ei) => {
                                                        const {institute, passOutYear, score} = edu;
                                                        return <div
                                                            style={{display: 'flex', flexDirection: "column", gap: "1px"}}
                                                            key={`${institute}.${ei}`}>
                                                            <Chip
                                                                color="info"
                                                                sx={{
                                                                    height: 'auto',
                                                                    '& .MuiChip-label': {
                                                                        display: 'block',
                                                                        whiteSpace: 'normal',
                                                                    },
                                                                    borderRadius: '0px !important'
                                                                }}
                                                                variant="outlined"
                                                                label={`${institute}`}
                                                            />
                                                            <Chip
                                                                variant="outlined"
                                                                color="success"
                                                                size="small"
                                                                sx={{
                                                                    borderRadius: '0px !important'
                                                                }}
                                                                label={`Pass-out year: ${passOutYear}
                                                    Score: ${score}
                                                    `}
                                                            />
                                                        </div>
                                                    })
                                                }</div>
                                        </AccordionDetails>
                                    </Accordion>
                                })
                            }
                        </Box>
                    </Stack>
                </Paper>
                <Pagination sx={{marginTop: "10px"}} onChange={handlePaginationClick} count={_.ceil(totalRecords / 10)}
                            color="primary"/>
            </Stack>
        </>
    );
}
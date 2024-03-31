export const FIELD_NAMES = {
    FIRST_NAME: {
        ID: 'firstname',
        LABEL: "First Name"
    },
    LAST_NAME: {
        ID: 'lastname',
        LABEL: "Last Name"
    },
    EMAIL: {
        ID: 'email',
        LABEL: "E-Mail"
    },
    PHONE: {
        ID: 'phone',
        LABEL: "Phone"
    },
    EDUCATION: {
        ID: 'education',
        LABEL: "Education"
    },
    INSTITUTION: {
        ID: 'institution',
        LABEL: "Institute"
    },
    PASS_OUT_YEAR: {
        ID: 'passoutyear',
        LABEL: "Pass-out Year"
    },
    SCORE: {
        ID: 'score',
        LABEL: "CGPI/Score"
    }
}

export const declarativeSchema = {
    [FIELD_NAMES.FIRST_NAME.ID]: {
        label: FIELD_NAMES.FIRST_NAME.LABEL,
        conditions: {
            type: "string",
            required: true,
            max: 20
        }
    },
    [FIELD_NAMES.LAST_NAME.ID]: {
        label: FIELD_NAMES.LAST_NAME.LABEL,
        conditions: {
            type: "string",
            required: true,
            max: 20
        }
    },
    [FIELD_NAMES.EMAIL.ID]: {
        label: FIELD_NAMES.EMAIL.LABEL,
        conditions: {
            type: "email",
            required: true,
            max: 50,
        }
    },
    [FIELD_NAMES.PHONE.ID]: {
        label: FIELD_NAMES.EMAIL.LABEL,
        conditions: {
            type: "email",
            required: true,
            max: 50
        }
    },
    [FIELD_NAMES.EDUCATION.ID]: {
        label: FIELD_NAMES.EDUCATION.LABEL,
        schema: {
            [FIELD_NAMES.INSTITUTION.ID]: {
                label: FIELD_NAMES.INSTITUTION.LABEL,
                conditions: {
                    type: "string",
                    required: true,
                    max: 50
                }
            },
            [FIELD_NAMES.PASS_OUT_YEAR.ID]: {
                label: FIELD_NAMES.PASS_OUT_YEAR.LABEL,
                conditions: {
                    type: "number",
                    required: true,
                    max: 4,
                    min: 4
                }
            },
            [FIELD_NAMES.SCORE.ID]: {
                label: FIELD_NAMES.SCORE.LABEL,
                conditions: {
                    type: "number",
                    required: true,
                    customValidation: value => {
                        return `${value}`.match(regex4Whole2decimalNumber)
                    }
                }
            }
        }
    }
}

const regex4Whole2decimalNumber = /^\d{1,4}(\.\d{1,2})?$/;

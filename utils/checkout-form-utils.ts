import {
    isValidPhoneNumber
} from 'libphonenumber-js';
var validCard = require("card-validator");

export enum FormActionTypes {
    BuildValidatedForm = 'BuildValidatedForm',
    UpdateFormField = 'UpdateFormField'
}

export interface FormAction<ActionType = any> {
    type: ActionType
}

export class BuildValidatedForm implements FormAction {
    readonly type = FormActionTypes.BuildValidatedForm
    constructor(){}
}
export interface Field {
    fieldName: FormFieldNames
    placeholder: string
    validator: (input: string, data?: any) => boolean
    value: string
    valid: boolean
}
export enum FormFieldNames {
    NAME = 'name',
    PHONE = 'phone',
    ADDRESS = 'street_address', 
    CITY = 'city',
    STATE = 'state',
    ZIPCODE = 'zip',
    CREDIT_CARD_NUMBER = 'card_number',
    CREDIT_CARD_EXP = 'expiration',
    CREDIT_CARD_CVC = 'cvc',
    CREDIT_CARD_ZIP = 'zip_code'
}
export interface FormState {
    fields: Field[],
    expectedCVCLength: number,
    valid: boolean
}
export class UpdateFormField implements FormAction {
    readonly type = FormActionTypes.UpdateFormField
    constructor(public payload: {itemIndex: number, value: string}){}
}

export type FormActions = UpdateFormField | BuildValidatedForm

export const validateStringInput = (s: string) => s.length > 2

export const validatePhone = (s: string) => {
    return isValidPhoneNumber(s, 'US')
}
export const validateCardNumber = (s: string) => {
    const validationObject = validCard.number(s)
    return validationObject.isValid
}

export const validateCVC = (cvc: string, expectedCVCLength: number) => {
    const reg = new RegExp(`^[0-9]{${expectedCVCLength}}$`)
    return reg.test(cvc)
}

export const validateZip = (zip: string) => {
    return /^[0-9]{5}$/.test(zip)
}

export const validateExp = (exp: string) => {
    return /^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/.test(exp)
}


export const getValidatorForFieldName = (fieldName: FormFieldNames) => {
    switch (fieldName) {
        case FormFieldNames.NAME:
        case FormFieldNames.ADDRESS:
        case FormFieldNames.CITY:
        default:
            return validateStringInput
        case FormFieldNames.PHONE:
            return validatePhone
        case FormFieldNames.CREDIT_CARD_NUMBER:
            return validateCardNumber
        case FormFieldNames.CREDIT_CARD_EXP:
            return validateExp
        case FormFieldNames.CREDIT_CARD_CVC:
            return validateCVC
        case FormFieldNames.ZIPCODE:
        case FormFieldNames.CREDIT_CARD_ZIP:
            return validateZip
    }
}

export const placeholders = {
    [FormFieldNames.NAME]: 'John Doe',
    [FormFieldNames.ADDRESS]: '9919 Rabbit Street',
    [FormFieldNames.PHONE]: '+1-201-867-5309',
    [FormFieldNames.CITY]: 'Dallas',
    [FormFieldNames.CREDIT_CARD_CVC]: '000',
    [FormFieldNames.CREDIT_CARD_EXP]: '09/29',
    [FormFieldNames.CREDIT_CARD_NUMBER]: '1001 0101 0101 0101',
    [FormFieldNames.CREDIT_CARD_ZIP]: '90210',
    [FormFieldNames.STATE]: 'TX',
    [FormFieldNames.ZIPCODE]: '90210'
}

export const buildInitialFormState = (): FormState => {
    return {
        fields: Object.values(FormFieldNames).map(val => {
            return ({
                fieldName: val,
                valid: false,
                value: '',
                placeholder: placeholders[val],
                validator: getValidatorForFieldName(val),
            })
        }),
        expectedCVCLength: 3, 
        valid: false,
    }
}

export const formReducer = (state: FormState, action: FormActions): FormState => {
    if(action.type === FormActionTypes.BuildValidatedForm){
        return buildInitialFormState()
    }
    const newFormState = {...state}
    const fieldToUpdate = newFormState.fields[action.payload.itemIndex]
    fieldToUpdate.value = action.payload.value
    fieldToUpdate.valid = fieldToUpdate.validator(action.payload.value)
    newFormState.valid = newFormState.fields.every(e => e.valid === true)
    return newFormState
}
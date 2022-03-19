import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from "@angular/forms"

export const usernameValidators: ValidatorFn[] = [Validators.pattern("\\w+"), Validators.minLength(4), Validators.maxLength(20), Validators.required];
export const passwordValidators: ValidatorFn[] = [Validators.minLength(4), Validators.maxLength(40), Validators.required];
export const emailValidator: ValidatorFn = Validators.pattern("^[\\w!#$%&'*+/=?`{|}~^-]+(?:\\.[\\w!#$%&'*+/=?`{|}~^-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$");
export const notEmptyListValidator: ValidatorFn = (control: AbstractControl) =>{
  return (control.value != null && control.value.length > 0) ? null : {empty: true};
}

export const notBlankValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null =>{
  let value = control.value;
  if(typeof(value) !== 'string') return {error: "not a string"};
  if(value.trim().length === 0) return {blankError: true};
  return null;
}

export const usernameOrEmailValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null =>{
    let usernameValid: boolean = usernameValidators.every((validator: ValidatorFn) => validator(control) === null);
    let emailValid: boolean = emailValidator(control) === null;
    return (usernameValid || emailValid) && control.value !=null ? null : {notEmailOrUsername: true};
}

export function sameValueValidator(...value: string[]): ValidatorFn{
    return (control: AbstractControl): ValidationErrors | null => {
      let test: boolean = true;
      for(let i=1; i<value.length && test; i++){
        test = test && control.get(value[i-1])?.value === control.get(value[i])?.value;
      }
      return test ? null : {notTheSameError: true};
  }
}

export function getErrorsMessage(control: AbstractControl, customErrorFactory?: (control: AbstractControl) => string | null): string{
    if(control.errors == null || control.untouched) return "";
    if(customErrorFactory){
      let temp = customErrorFactory(control);
      if(temp)
        return temp;
    }
    if(control.errors.required)
      return "To pole jest wymagane";
    if(control.errors.minlength)
      return `Minumum ${control.errors.minlength.requiredLength} znaków`;
    if(control.errors.maxlength)
      return `Maksymalnie ${control.errors.maxlength.requiredLength} znaków`;
    if(control.errors.email)
      return "Niewłaściwy email";
    if(control.errors.pattern)
      return "Niewłaściwy format";
    if(control.errors.notEmailOrUsername)
      return "Niewłaściwa nazwa użytkownika lub email";
    if(control.errors.blankError)
      return "Same znaki białe";
    return "Zła wartość";
  }


import {
  AbstractControl,
  FormControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export function controlMatchValidator(toMatch: FormControl): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return toMatch.value !== control.value
      ? { noMatch: { value: control.value } }
      : null;
  };
}

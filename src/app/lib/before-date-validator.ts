import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { isBefore } from 'date-fns';

export function beforeDateValidate(date: Date): ValidatorFn {
  return (control: AbstractControl<Date | null>): ValidationErrors | null => {
    if (control.value === null) return null;
    return isBefore(date, control.value)
      ? { notBefore: { value: control.value } }
      : null;
  };
}

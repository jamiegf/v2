import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value.length < 7) {
      return {
        size: {
          value: control.value,
        },
      };
    } else if (!/[!-/:-@[-`{-~]/.test(control.value)) {
      return {
        special: {
          value: control.value,
        },
      };
    } else if (!/\d/.test(control.value)) {
      return {
        numeric: {
          value: control.value,
        },
      };
    } else {
      return null;
    }
  };
}

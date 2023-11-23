import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertGeAmountToText',
  standalone: true,
})
export class ConvertGeAmountToTextPipe implements PipeTransform {
  transform(
    amount: number,
    options?: { isPoints?: boolean; showFreeText?: boolean },
  ): string {
    return convertGeAmountToText(amount, options);
  }
}

export function convertGeAmountToText(
  amount: number,
  options?: { isPoints?: boolean; showFreeText?: boolean },
): string {
  if (options?.showFreeText && amount === 0) return 'Free';
  if (options?.isPoints) {
    return `${amount * 100}pts`;
  } else {
    return `£${amount}`;
  }
}
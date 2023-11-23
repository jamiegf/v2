import { Pipe, PipeTransform } from '@angular/core';
import { format } from 'date-fns';

/**
 * Date formatter using date fns as the angular pipe is lacking.
 */
@Pipe({
  name: 'formatDate',
  standalone: true,
})
export class FormatDatePipe implements PipeTransform {
  transform(date: Date, outputFormat: string): string {
    return format(date, outputFormat);
  }
}

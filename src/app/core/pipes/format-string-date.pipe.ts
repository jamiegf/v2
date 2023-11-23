import { Pipe, PipeTransform } from '@angular/core';
import { format, parse } from 'date-fns';

/**
 * Date formatter using date fns as the angular pipe is lacking.
 */
@Pipe({
  name: 'formatStringDate',
  standalone: true,
})
export class FormatStringDatePipe implements PipeTransform {
  transform(dateString: string, inputFormat: string, outputFormat: string): string {
    const date = parse(dateString, inputFormat, new Date());
    return format(date, outputFormat);
  }
}

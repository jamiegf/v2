import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'parseNumber',
  standalone: true,
})
export class ParseNumberPipe implements PipeTransform {
  transform(value: string | number): number {
    const transformed = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(transformed)) throw new Error(`${value} transforms to NaN`);
    return transformed;
  }
}

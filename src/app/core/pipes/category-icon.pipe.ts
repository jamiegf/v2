import { Pipe, PipeTransform } from '@angular/core';
import { getCategoryIcon } from '../models/pool/category/category-icon.type';
import { CategoryId } from '../models/pool/category/category-id.type';

@Pipe({
  name: 'categoryIcon',
  standalone: true
})
export class CategoryIconPipe implements PipeTransform {
  transform(id: CategoryId): string {
    return getCategoryIcon(id);
  }
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable, combineLatest, map } from 'rxjs';
import { Category } from 'src/app/core/models/pool/category/category.type';
import { CategoryService } from 'src/app/core/services/pool/category.service';

@Component({
  selector: 'mipools-front-end-category-icons',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './category-icons.component.html',
  styleUrls: ['./category-icons.component.scss'],
})
export class CategoryIconsComponent {
  constructor(private categoryService: CategoryService) {}

  public categoryIcons$: Observable<CategoryIcon[] | undefined> = combineLatest(
    {
      categoryData: this.categoryService.availableCategoryData$,
      categories: this.categoryService.categoryFilter$,
    },
  ).pipe(
    map((stream) => {
      if (stream.categoryData === undefined) return undefined;
      return stream.categoryData.reduce<CategoryIcon[]>(
        (categoryIcons, categoryData) => {
          const category = categoryData.category;
          const count = categoryData.count;
          const selected = stream.categories?.[category.id] !== undefined;
          const routerLink = selected ? '/lobby' : `/lobby/${category.url}`;
          categoryIcons.push({ category, count, selected, routerLink });
          return categoryIcons;
        },
        [],
      );
    }),
  );

  public trackBy(_index: number, item: CategoryIcon): string {
    return item.category.id;
  }
}

export type CategoryIcon = {
  category: Category;
  count: number;
  selected: boolean;
  routerLink: string;
};

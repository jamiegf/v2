import {
  CategoryBackgroundImage,
  getCategoryBackground,
} from 'src/app/core/models/pool/category/category-background-image.type';
import {
  CategoryIcon,
  getCategoryIcon,
} from 'src/app/core/models/pool/category/category-icon.type';
import { CategoryId } from 'src/app/core/models/pool/category/category-id.type';
import {
  CategoryTitle,
  getCategoryTitle,
} from 'src/app/core/models/pool/category/category-title.type';
import {
  CategoryUrl,
  CategoryUrlToCategoryId,
} from 'src/app/core/models/pool/category/url-to-category-map.type';

export interface Category {
  id: CategoryId;
  title: CategoryTitle;
  backgroundImage: CategoryBackgroundImage;
  icon: CategoryIcon;
  url: CategoryUrl;
}

export function createCategory(id: CategoryId): Category {
  return {
    id: id,
    title: getCategoryTitle(id),
    backgroundImage: getCategoryBackground(id),
    icon: getCategoryIcon(id),
    url: CategoryUrl[id],
  };
}

export {
  CategoryUrlToCategoryId,
  getCategoryBackground,
  getCategoryIcon,
  getCategoryTitle,
};


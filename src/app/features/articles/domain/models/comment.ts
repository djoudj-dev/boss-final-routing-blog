import { Article } from './article';

export type Comment = {
  id: string;
  idArticle: Article['id'];
  author: string;
  content: string;
};

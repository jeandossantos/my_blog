import { IArticle, IArticleRepository } from './IArticleRepository';
import { z } from 'zod';

type CreateArticleProps = Omit<
  IArticle,
  'id' | 'createdAt' | 'updatedAt' | 'tags'
> & { tags: string[] };
type UpdateArticleProps = Omit<
  IArticle,
  'authorId' | 'createdAt' | 'updatedAt'
>;

export class ArticleService {
  constructor(private articleRepository: IArticleRepository) {}

  async create(props: CreateArticleProps) {
    const { title, imageUrl, content, authorId, tags } = z
      .object({
        title: z.string().min(2),
        imageUrl: z.string().optional(),
        content: z.string().min(200),
        authorId: z.string().uuid(),
        tags: z.array(z.string().uuid()).min(1),
      })
      .parse(props);

    const article = await this.articleRepository.create({
      title,
      imageUrl,
      content,
      authorId,
      tags: tags.map((t) => {
        return { id: t };
      }),
    });

    return article;
  }

  async findById(id: string) {
    const article = await this.articleRepository.findById(id);

    return article;
  }

  async remove(articleId: string) {
    await this.articleRepository.remove(articleId);
  }

  async update(props: UpdateArticleProps) {
    const { id, title, description, imageUrl, content, tags } = z
      .object({
        id: z.string(),
        title: z.string().min(2),
        imageUrl: z.string().optional(),
        content: z.string().min(200),
        description: z.string().optional(),
        tags: z.array(z.string().uuid()).min(1),
      })
      .parse(props);

    const article = await this.articleRepository.update({
      id,
      title,
      imageUrl,
      description,
      content,
      tags: tags.map((t) => {
        return { id: t };
      }),
    });

    return article;
  }

  async list(page?: number, search?: string) {
    const { articles, count, limit } = await this.articleRepository.find(
      page,
      search
    );

    const articlesWithDescription = articles.map((article) => {
      if (!article.description) {
        article.description = article.content.slice(0, 200);
      }

      return article;
    });

    return { articles: articlesWithDescription, count, limit };
  }

  async findByTagId(page: number, tagId: string) {
    const { articles, count, limit } = await this.articleRepository.findByTag(
      page,
      tagId
    );

    const articlesWithDescription = articles.map((article) => {
      if (!article.description) {
        article.description = article.content.slice(0, 200);
      }

      return article;
    });

    return { articles: articlesWithDescription, count, limit };
  }

  async findByUserId(page: number, userId: string) {
    const { articles, count, limit } = await this.articleRepository.findByUser(
      page,
      userId
    );

    const articlesWithDescription = articles.map((article) => {
      if (!article.description) {
        article.description = article.content.slice(0, 264);
      }

      return article;
    });

    return { articles: articlesWithDescription, count, limit };
  }
}

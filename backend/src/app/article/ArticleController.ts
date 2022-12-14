import { Request, Response } from 'express';
import { ArticleService } from './ArticleService';

export class ArticleController {
  constructor(private articleService: ArticleService) {}

  async store(req: Request, res: Response) {
    const { title, description, content, authorId, tags } = req.body;

    const article = await this.articleService.create({
      title,
      description,
      content,
      authorId,
      imageUrl: req.file?.filename,
      tags: typeof tags === 'string' ? [tags] : tags,
    });

    return res.status(201).json(article);
  }

  async index(req: Request, res: Response) {
    const { search = '', page = 1 } = req.query;

    const articles = await this.articleService.list(
      Number(page),
      String(search)
    );

    return res.json(articles);
  }

  async destroy(req: Request, res: Response) {
    const { articleId } = req.params;

    await this.articleService.remove(articleId);

    return res.send();
  }

  async show(req: Request, res: Response) {
    const { articleId } = req.params;

    const article = await this.articleService.findById(articleId);

    return res.json(article);
  }

  async findByTag(req: Request, res: Response) {
    const { tagId } = req.params;
    const page = Number(req.query.page) || 1;

    const articles = await this.articleService.findByTagId(page, tagId);

    return res.json(articles);
  }

  async findByUser(req: Request, res: Response) {
    const userId = req.params.userId;
    const page = Number(req.query.page) || 1;

    const articles = await this.articleService.findByUserId(page, userId);

    return res.json(articles);
  }

  async update(req: Request, res: Response) {
    const { title, description, content, tags } = req.body;
    const articleId = req.params.articleId;

    const article = await this.articleService.update({
      title,
      description,
      content,
      imageUrl: req.file?.filename,
      tags,
      id: articleId,
    });

    return res.json(article);
  }
}

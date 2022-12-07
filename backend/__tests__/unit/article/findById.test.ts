import { randomUUID } from 'crypto';
import { ZodError } from 'zod';

import { IArticle } from './../../../src/app/article/IArticle';
import { ITag } from '../../../src/app/tag/ITagRepository';
import { IUser } from '../../../src/app/user/IUserRepository';

import { ArticleService } from '../../../src/app/article/ArticleService';

import { ArticleRepoInMemory } from '../../../src/inMemory/ArticleRepoInMemory';
import { UserRepoInMemory } from '../../../src/inMemory/UserRepoInMemory';
import { TagRepoInMemory } from '../../../src/inMemory/TagRepoInMemory';

const articleService = new ArticleService(new ArticleRepoInMemory());

let article: IArticle;

beforeAll(async () => {
  article = await articleService.create({
    title: 'My Article',
    content:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries.",
    imageUrl: 'imageUrl.png',
    tags: [randomUUID()],
    authorId: randomUUID(),
  });
});
describe('find article by id', () => {
  it('should find an article by its id', async () => {
    const result = await articleService.findById(article.id!);

    expect(result).toEqual(article);
  });
});
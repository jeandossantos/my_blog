import { useEffect, useState } from 'react';
import { AiOutlineLoading } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { useArticle } from '../../hooks/useArticle';

import { ArticleItem } from './ArticleItem';

interface ITag {
  id: string;
  name: string;
}

interface IArticle {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
  tags: ITag[];
}

export function Home() {
  const { listArticles } = useArticle();
  const [loading, setLoading] = useState(false);

  const [articles, setArticles] = useState<IArticle[]>([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(1);
  const [limit, setLimit] = useState(1);
  const [loadMore, setLoadMore] = useState(true);

  useEffect(() => {
    handleListArticles();
  }, []);

  async function handleListArticles() {
    setLoading(true);
    const { articles: data, count, limit } = await listArticles({ page });

    setCount(count);
    setLimit(limit);
    setArticles([...articles, ...data]);

    setPage(page + 1);

    if (data.length === 0) setLoadMore(false);
    setLoading(false);
  }

  return (
    <main className="row-span-1 col-span-1 bg-zinc-800 mx-3  text-zinc-100 mt-6 rounded-lg border-zinc-500 border-4">
      <h1 className="font-[Lalezar] mb-8 mt-5 text-center text-zinc-100 text-3xl">
        Recentes
      </h1>

      {articles.map((article) => {
        return <ArticleItem article={article} key={article.id} />;
      })}

      <div className="flex justify-center items-center mb-4 ">
        {loadMore && (
          <button
            onClick={handleListArticles}
            className="font-[Lalezar] flex justify-center gap-2 items-center bg-zinc-900 border-4 border-zinc-500
             rounded h-12 w-[300px] hover:bg-red-700"
          >
            {loading ? (
              <AiOutlineLoading className="animate-spin h-5 w-5" />
            ) : (
              'Carregar mais'
            )}
          </button>
        )}
      </div>
    </main>
  );
}

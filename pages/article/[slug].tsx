import { FunctionComponent } from "react";
import fs from "fs";
import matter from "gray-matter";
import styles from "../../styles/article.module.css";
import { ArticleInfo } from "../../interfaces/article";
import Markdown from "../../component/markdown";
import Image from "next/image";

interface IProps {
  article: ArticleInfo;
}

const Article: FunctionComponent<IProps> = ({ article }) => {
  return (
    <div className={styles.article}>
      <div className={styles.thumbnail}>
        {/* <Image src={article.meta.thumbnail} alt="thumbnanil" /> */}
        <Image
          src={article.meta.thumbnail}
          unoptimized
          priority
          layout="fill"
          alt="banner"
        />
        <div className={styles.title}>
          <h1>{article.meta.title}</h1>
        </div>
      </div>

      <div className={styles.content}>
        <Markdown content={article.content} />
      </div>
    </div>
  );
};

export async function getStaticProps({ ...ctx }) {
  const { slug } = ctx.params;

  const content = fs.readFileSync(`uploads/${slug}.md`).toString();

  const info = matter(content);

  const article = {
    meta: {
      ...info.data,
      slug,
    },
    content: info.content,
  };

  return {
    props: {
      article: article,
    },
  };
}

export async function getStaticPaths() {
  const files = fs.readdirSync("uploads");
  const paths = files.map((file) => ({
    params: {
      slug: file.split(".")[0],
    },
  }));

  return {
    paths,
    fallback: false,
  };
}

export default Article;

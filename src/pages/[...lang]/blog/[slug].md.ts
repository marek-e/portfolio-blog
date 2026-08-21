import type { APIContext, GetStaticPaths } from 'astro';
import { postToMarkdown } from '@/lib/post-markdown';
import { getBlogPostRoutes, type BlogPost } from '@/lib/blog-routes';
import { defaultLang } from '@/i18n';

export const getStaticPaths: GetStaticPaths = async () => {
  const routes = await getBlogPostRoutes();

  // Opting out drops the file entirely, so a post's prose is not left sitting at
  // a public URL once the header action is taken away. This is filtered after the
  // route's post is resolved: opting out of a translation must not promote the
  // other language into its slot.
  return routes.filter((route) => route.props.post.data.copyMarkdown);
};

type Props = {
  post: BlogPost;
};

export async function GET({ props, params, site }: APIContext & { props: Props }) {
  const { post } = props;
  const lang = params.lang === 'en' ? 'en' : defaultLang;
  const slug = post.id.split('/').pop();
  const url = new URL(lang === 'en' ? `/en/blog/${slug}/` : `/blog/${slug}/`, site).toString();

  const markdown = postToMarkdown(post, { url, lang });

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  });
}

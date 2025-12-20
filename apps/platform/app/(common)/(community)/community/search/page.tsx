import { Badge } from "@/components/ui/badge";
import SearchBar from "@/components/common/search-bar";
import { Search } from "lucide-react";
import { searchPosts } from "~/actions/search";
import { getSession } from "~/auth/server";
import CommunityPostList from "../list";

export default async function SearchPage(props: {
  searchParams: Promise<{
    q?: string;
    page?: number;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams.q || "";
  const page = searchParams.page || 1;

  const session = await getSession();
  const posts = query ? await searchPosts(query, page, 10) : [];

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6">
      {/* Search Header */}
      <div className="rounded-xl border border-border/40 bg-card/80 backdrop-blur-xl px-6 py-4 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex size-10 items-center justify-center rounded-lg border bg-primary/10 text-primary">
            <Search className="size-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Search Community</h1>
            <p className="text-sm text-muted-foreground">
              Find posts, discussions, and builders
            </p>
          </div>
        </div>

        <SearchBar />
      </div>

      {/* Results */}
      {query && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <p className="text-sm text-muted-foreground">
              {posts.length > 0 ? (
                <>
                  Found <Badge variant="secondary" className="font-mono">{posts.length}</Badge> results for
                  <Badge variant="outline" className="ml-1">{query}</Badge>
                </>
              ) : (
                <>No results found for <Badge variant="outline">{query}</Badge></>
              )}
            </p>
          </div>

          {posts.length > 0 ? (
            <CommunityPostList posts={posts} user={session?.user} />
          ) : (
            <div className="rounded-xl border border-dashed border-border/50 bg-muted/20 px-6 py-12 text-center">
              <Search className="size-12 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold mb-2">No posts found</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Try different keywords or check your spelling. You can search by post title, content, or author name.
              </p>
            </div>
          )}
        </div>
      )}

      {!query && (
        <div className="rounded-xl border border-dashed border-border/50 bg-muted/20 px-6 py-12 text-center">
          <Search className="size-12 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-semibold mb-2">Start searching</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Enter keywords to search through community posts, discussions, and find builders.
          </p>
        </div>
      )}
    </div>
  );
}

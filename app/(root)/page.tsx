"use client";
import Hero from "@/components/Hero";
import BookCard from "@/components/BookCard";
import { searchBooks } from "@/lib/actions/books.actions";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search } from "lucide-react";

const Page = () => {
  return (
    <Suspense fallback={<div className="wrapper container"><Hero /><div>Loading...</div></div>}>
      <PageContent />
    </Suspense>
  );
};

const PageContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("query") || "";

  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    searchBooks(query).then((result) => {
      if (result.success) {
        setBooks(result.data || []);
      } else {
        console.error("Error searching books:", result.error);
        setBooks([]);
      }
    }).finally(() => setLoading(false));
  }, [query]);

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("query", value);
    } else {
      params.delete("query");
    }
    router.replace(`?${params.toString()}`);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/books/${id}`, { method: "DELETE" });
      if (!res.ok) {
        console.error('Failed to delete book:', res.status, res.statusText);
        alert('Failed to delete book.');
        return;
      }
      const data = await res.json();
      if (data.success) {
        const result = await searchBooks(query);
        setBooks(result.success ? result.data || [] : []);
      } else {
        console.error('API returned error:', data.error);
        alert("Failed to delete book: " + (data.error || "Unknown error"));
      }
    } catch (e) {
      console.error('Error deleting book:', e);
      alert("Failed to delete book.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="wrapper container">
      <Hero />
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl font-semibold text-[#2d2218]">
          Recent Books
        </h2>
        <div className="library-search-wrapper">
          <Search className="ml-3 h-4 w-4 shrink-0 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search by title or author..."
            defaultValue={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="library-search-input"
          />
        </div>
      </div>
      <div className="library-books-grid">
        {loading ? (
          <div>Loading...</div>
        ) : books.length === 0 ? (
          <div className="col-span-full text-center text-[var(--text-muted)] py-8">
            No books found.
          </div>
        ) : (
          books.map((book) => (
            <BookCard
              key={book._id}
              _id={book._id}
              title={book.title}
              author={book.author}
              coverURL={book.coverImageBase64 || book.coverURL || ""}
              slug={book.slug}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Page;


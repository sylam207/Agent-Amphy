"use client";
import Hero from "@/components/Hero";
import BookCard from "@/components/BookCard";
import { getBooks } from "@/lib/actions/books.actions";
import { useEffect, useState } from "react";



const fetchBooks = async () => {
  try {
    const res = await fetch('/api/books', { cache: 'no-store' });
    if (!res.ok) {
      console.error('Failed to fetch books:', res.status, res.statusText);
      return [];
    }
    const data = await res.json();
    if (!data.success) {
      console.error('API returned error:', data.error);
      return [];
    }
    return data.data || [];
  } catch (err) {
    console.error('Error fetching books:', err);
    return [];
  }
};

const Page = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchBooks().then(setBooks).finally(() => setLoading(false));
  }, []);

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
        // Refetch the books from the server to ensure sync
        const freshBooks = await fetchBooks();
        setBooks(freshBooks);
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
      <div className="library-books-grid">
        {loading ? (
          <div>Loading...</div>
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

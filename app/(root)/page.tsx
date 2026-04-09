'use client';

import Hero from "@/components/Hero";
import { sampleBooks } from "@/lib/constants";
import BookCard from "@/components/BookCard";
import { useEffect, useState } from "react";
import { getBooks } from "@/lib/actions/books.actions";
import { IBook } from "@/types";

const Page = () => {
  const [books, setBooks] = useState<IBook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const result = await getBooks();
        if (result.success && result.data) {
          setBooks(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Use database books if available, otherwise fallback to sample books
  const displayBooks = books.length > 0 ? books : sampleBooks;

  return (
    <div className="wrapper container">
      <Hero />
      <div className="library-books-grid">
        {displayBooks.map((book: any) => (
          <BookCard
            key={book._id}
            title={book.title}
            author={book.author}
            coverURL={book.coverImageBase64 || book.coverURL}
            slug={book.slug}
          />
        ))}
      </div>
    </div>
  );
};

export default Page;

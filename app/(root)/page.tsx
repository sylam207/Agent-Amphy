import Hero from "@/components/Hero";

import BookCard from "@/components/BookCard";
import { getBooks } from "@/lib/actions/books.actions";

const Page = async () => {
  const booksResult = await getBooks();

  const books = booksResult.success && booksResult.data ? booksResult.data : [];

  return (
    <div className="wrapper container">
      <Hero />
      <div className="library-books-grid">
        {books.map((book) => (
          <BookCard
            key={book._id}
            title={book.title}
            author={book.author}
            coverURL={book.coverImageBase64 || book.coverURL || ""}
            slug={book.slug}
          />
        ))}
      </div>
    </div>
  );
};

export default Page;

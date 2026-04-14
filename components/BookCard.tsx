import { BookCardProps } from '@/types';
import Link from 'next/link';
import Image from "next/image";
import { Button } from './ui/button';



interface BookCardPropsWithDelete extends BookCardProps {
    _id: string;
    onDelete?: (id: string) => void;
}

const BookCard = ({ title, author, coverURL, slug, _id, onDelete }: BookCardPropsWithDelete) => {
    // Check if it's a base64 image (data URL)
    const isBase64 = coverURL?.startsWith('data:');

    // Prevent navigation when clicking delete
    const handleDeleteClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (onDelete) onDelete(_id);
    };

    return (
        <Link href={`/books/${slug}`}>
            <article className="book-card relative">
                <figure className="book-card-figure">
                    <div className="book-card-cover-wrapper">
                        {isBase64 ? (
                            <img
                                src={coverURL}
                                alt={title}
                                className="book-card-cover"
                                width={133}
                                height={200}
                            />
                        ) : (
                            <Image
                                src={coverURL}
                                alt={title}
                                width={133}
                                height={200}
                                className="book-card-cover"
                            />
                        )}
                    </div>
                </figure>

                <figcaption className="book-card-meta">
                    <h3 className="book-card-title">{title}</h3>
                    <p className="book-card-author">{author}</p>
                </figcaption>

                <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 z-10 shadow-soft border border-[--border-medium] bg-[--bg-tertiary] text-[--text-secondary] hover:bg-[--accent-warm-hover]"
                    onClick={handleDeleteClick}
                >
                    Delete
                </Button>
            </article>
        </Link>
    );
};

export default BookCard;
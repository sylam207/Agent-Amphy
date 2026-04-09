import { BookCardProps } from '@/types';
import Link from 'next/link';
import Image from "next/image"


const BookCard = ({title, author, coverURL, slug}: BookCardProps) => {
    // Check if it's a base64 image (data URL)
    const isBase64 = coverURL?.startsWith('data:');

    return (
        <Link href={`/books/${slug}`}>
            <article className="book-card">
                <figure className="book-card-figure">
                    <div className="book-card-cover-wrapper">
                        {isBase64 ? (
                            // Use regular img tag for base64 images
                            <img 
                                src={coverURL} 
                                alt={title} 
                                className="book-card-cover"
                                width={133}
                                height={200}
                            />
                        ) : (
                            // Use Next.js Image for remote URLs
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
            </article>
        </Link>
    );
};

export default BookCard;
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { getBookBySlug } from "@/lib/actions/books.actions";
import VapiControls from "@/components/VapiControls";

interface PageProps {
  params: { slug: string } | Promise<{ slug: string }>;
}

const Page = async (props: PageProps) => {
  const { params } = await props;
  const { slug } = await params;

  const { userId } = await auth();
  if (!userId) {
    redirect("/");
  }

  const bookResult = await getBookBySlug(slug);
  if (!bookResult.success || !bookResult.data) {
    redirect("/");
  }

  const book = bookResult.data;


  return (
    <div className="back-page-container">
      <Link href="/" aria-label="Go back" className="back-btn-floating">
        <ArrowLeft size={20} />
      </Link>

      <div className="mx-auto max-w-4xl space-y-8 px-4 pt-10 pb-8 sm:px-6">
        <VapiControls book={book} />
      </div>
    </div>
  );
};

export default Page;

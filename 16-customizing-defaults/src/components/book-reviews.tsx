import { useReviewsForBook } from "../services/queries";
import Review from "./review";

export default function LatestReview({ bookId }: { bookId: string }) {
  const { data, isPending, isError } = useReviewsForBook(bookId);

  if (isPending) {
    return <Loading />;
  }

  if (isError) {
    return <ErrorCmp />;
  }

  return (
    <div
      className="d-flex flex-column align-items-end container py-4"
      style={{ marginLeft: "23.25rem", maxWidth: "640px" }}
    >
      {data.map((review) => (
        <Review review={review} key={review.reviewId} />
      ))}
    </div>
  );
}

function Loading() {
  return <main>Loading...</main>;
}

function ErrorCmp() {
  return <main>Woops there was an error...</main>;
}

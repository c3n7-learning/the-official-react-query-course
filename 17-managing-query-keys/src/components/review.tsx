import type { Review as ReviewT } from "../types/review.ts";

export default function Review({ review }: { review: ReviewT }) {
  return (
    <div
      key={review.reviewId}
      className="card mt-2"
      style={{ maxWidth: "640px" }}
    >
      <div className="card-body">
        <div className="card-title">
          {review.title} {"  "}
          <small className="text-body-secondary">({review.rating} / 5)</small>
        </div>
        <div className="card-text"></div>
        <div className="card-text">{review.text}</div>
      </div>
    </div>
  );
}

import { useLatestReview } from "../services/queries";
import Review from "./review";

export default function LatestReview() {
  const { data, isPending, isError } = useLatestReview();

  if (isPending) {
    return <Loading />;
  }

  if (isError) {
    return <ErrorCmp />;
  }

  if (!data) {
    return <div>Whoops! No review found!</div>;
  }

  return (
    <div>
      <div>Latest review for </div>
      <div className="d-flex flex-wrap">
        <Review review={data} />
      </div>
    </div>
  );
}

function Loading() {
  return <main>Loading...</main>;
}

function ErrorCmp() {
  return <main>Woops there was an error...</main>;
}

import { useActivities } from "../services/queries";

export function Activities() {
  const { data, isPending, isError } = useActivities();

  if (isPending) {
    return <Loading />;
  }

  if (isError) {
    return <ErrorCmp />;
  }

  return (
    <div>
      <div>Activites</div>
      <main className="d-flex flex-column gap-2">
        {data.map((activity, id) => (
          <div key={id} className="card mt-2" style={{ maxWidth: "640px" }}>
            <div className="card-body">
              <div className="card-text">
                {activity.title} {"  "}
              </div>

              <div className="card-text">
                <small className="text-body-secondary">
                  {activity.done_at}
                </small>
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

function Loading() {
  return <main>Loading...</main>;
}

function ErrorCmp() {
  return <main>Woops there was an error...</main>;
}

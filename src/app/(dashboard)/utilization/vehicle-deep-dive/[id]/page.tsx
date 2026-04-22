/**
 * Placeholder route for a single vehicle's deep-dive detail.
 * Wired up so Fleet Vehicles table rows can link here on click.
 */
type Props = {
  params: { id: string };
};

export default function VehicleDeepDiveDetailPage({ params }: Props) {
  return (
    <div className="fs-animate-enter flex flex-col gap-lg">
      <h1 className="text-display-sm font-semibold text-text-primary">
        Vehicle deep-dive
      </h1>
      <p className="text-base text-text-tertiary">
        Vehicle id: <span className="font-semibold text-text-primary">{params.id}</span>
      </p>
      <p className="text-sm text-text-quaternary">
        (Placeholder — this page will be built out in a later step.)
      </p>
    </div>
  );
}

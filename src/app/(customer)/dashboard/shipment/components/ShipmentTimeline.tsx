"use client";

interface TimelineEvent {
  id: string;
  status: string;
  description: string;
  createdAt: string;
}

interface Props {
  timeline: TimelineEvent[];
}

export default function ShipmentTimeline({
  timeline,
}: Props) {
  if (!timeline?.length) {
    return (
      <div className="rounded-2xl border bg-white p-8 text-center">
        <p className="text-sm text-neutral-500">
          No tracking updates available.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-white p-6">

      <h2 className="text-lg font-bold mb-6">
        Shipment Timeline
      </h2>

      <div className="relative border-l-2 border-neutral-200 ml-3 space-y-8">

        {timeline.map((event) => (

          <div
            key={event.id}
            className="relative pl-8"
          >

            <div className="absolute -left-[11px] top-1 h-5 w-5 rounded-full bg-black border-4 border-white shadow" />

            <h4 className="font-semibold">
              {event.status.replaceAll("_", " ")}
            </h4>

            <p className="text-sm text-neutral-600 mt-1">
              {event.description}
            </p>

            <p className="text-xs text-neutral-400 mt-2">
              {new Date(event.createdAt).toLocaleString()}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}
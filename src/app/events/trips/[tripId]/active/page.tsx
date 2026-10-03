// src/app/organizer/dashboard/trips/[tripId]/active/page.tsx
'use client';

import { useEffect, useState, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { io, Socket } from 'socket.io-client';
import { 
  ArrowLeft, Truck, User, Users, MapPin, Clock, 
  CheckCircle2, Circle, AlertCircle, Phone, RefreshCw, ExternalLink, Compass 
} from 'lucide-react';
import { eventsApi } from '@/src/lib/eventsApi';

// Dynamically import Leaflet components with SSR disabled to prevent window is not defined errors
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Polyline = dynamic(
  () => import('react-leaflet').then((mod) => mod.Polyline),
  { ssr: false }
);

const getSocketUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (typeof window !== 'undefined') {
    if (envUrl && envUrl.includes('localhost')) {
      return `http://${window.location.hostname}:5000`;
    }
    if (envUrl) return envUrl;
    return `http://${window.location.hostname}:5000`;
  }
  return envUrl || 'http://localhost:5000';
};

let socket: Socket;

const WORKFLOW_STEPS = [
  { key: 'ASSIGNED', label: 'Vehicle assigned' },
  { key: 'ACCEPTED', label: 'Rider accepted trip' },
  { key: 'PICKUP', label: 'Arrived at pickup' },
  { key: 'BOARDING', label: 'Boarding started' },
  { key: 'IN_TRANSIT', label: 'In transit to venue' },
  { key: 'ARRIVED', label: 'Arrived at destination' },
  { key: 'RETURN', label: 'Return journey' },
  { key: 'COMPLETED', label: 'Trip completed' },
];

export default function OrganizerActiveTripPage({ params }: { params: Promise<{ tripId: string }> }) {
  const resolvedParams = use(params);
  const tripId = resolvedParams.tripId;
  const router = useRouter();

  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);
  const [liveLocation, setLiveLocation] = useState<{ lat: number; lng: number; heading?: number } | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [customIcons, setCustomIcons] = useState<{ vehicleMarkerIcon: any; targetDestinationIcon: any } | null>(null);

  // Initialize Leaflet custom div icons on the client side
  useEffect(() => {
    import('leaflet').then((L) => {
      const vIcon = L.divIcon({
        html: `<div style="background-color:#000; color:#fff; border-radius:50%; width:36px; height:36px; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 10px rgba(0,0,0,0.4); border:2px solid #10b981;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18 10l-2-4H8L6 10l-2.5 1.1C2.7 11.3 2 12.1 2 13v3c0 .6.4 1 1 1h2m2 0a2 2 0 1 0 4 0a2 2 0 0 0-4 0zm10 0a2 2 0 1 0 4 0a2 2 0 0 0-4 0z"/></svg></div>`,
        className: '',
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const tIcon = L.divIcon({
        html: `<div style="background-color:#059669; color:#fff; border-radius:50%; width:32px; height:32px; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 6px rgba(0,0,0,0.3); border:2px solid #fff;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg></div>`,
        className: '',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      setCustomIcons({ vehicleMarkerIcon: vIcon, targetDestinationIcon: tIcon });
    });
  }, []);

  const fetchTripDetails = useCallback(async () => {
    try {
      setLoading(true);
      const data = await eventsApi.getActiveEventTripDetails(tripId);
      setTrip(data);
      if (data?.currentLat && data?.currentLng) {
        setLiveLocation({ lat: data.currentLat, lng: data.currentLng });
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error('Failed to load trip logistics:', err);
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    fetchTripDetails();
  }, [fetchTripDetails]);

  // Connect to Socket.io to receive live read-only telemetry from the rider
  useEffect(() => {
    socket = io(getSocketUrl(), {
      autoConnect: true,
      transports: ['websocket', 'polling'],
    });

    socket.emit('join:trip', tripId);

    socket.on('trip:locationUpdated', (data: { latitude: number; longitude: number; heading?: number }) => {
      setLiveLocation({ lat: data.latitude, lng: data.longitude, heading: data.heading });
      setLastUpdated(new Date());
    });

    socket.on('trip:statusUpdated', () => {
      fetchTripDetails();
    });

    return () => {
      if (socket) {
        socket.emit('leave:trip', tripId);
        socket.disconnect();
      }
    };
  }, [tripId, fetchTripDetails]);

  // Extract coordinates from backend data safely
  const targetLat = trip?.route?.destinationLat ?? 6.5244;
  const targetLng = trip?.route?.destinationLng ?? 3.3792;
  const originLat = trip?.route?.originLatitude ?? liveLocation?.lat ?? 6.4530;
  const originLng = trip?.route?.originLongitude ?? liveLocation?.lng ?? 3.3958;

  const currentVehicleLat = liveLocation?.lat ?? originLat;
  const currentVehicleLng = liveLocation?.lng ?? originLng;

  // Fetch routing polyline for map display
  useEffect(() => {
    if (!originLat || !originLng || !targetLat || !targetLng) return;

    async function fetchPolyline() {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${originLng},${originLat};${targetLng},${targetLat}?overview=full&geometries=geojson`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.routes && data.routes.length > 0) {
          const points = data.routes[0].geometry.coordinates.map((c: [number, number]) => [c[1], c[0]]);
          setRouteCoordinates(points);
        }
      } catch (err) {
        console.error('Map routing calculation failed:', err);
      }
    }
    fetchPolyline();
  }, [originLat, originLng, targetLat, targetLng]);

  if (loading && !trip) {
    return (
      <div className="w-full h-[70vh] bg-[#0e131f] border border-neutral-800 rounded-3xl flex items-center justify-center font-mono text-neutral-500 animate-pulse">
        Initializing logistics monitoring engine...
      </div>
    );
  }

  const checkedInCount = trip?.bookings?.filter((b: any) => b.boardingStatus === 'CHECKED_IN' || b.boardingStatus === 'BOARDED').length || 0;
  const totalBookings = trip?.bookings?.length || 0;
  const vehicleInfo = trip?.vehicle;
  const driverInfo = trip?.driver?.user;
  const currentStatus = trip?.status || 'SCHEDULED';

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-24 font-sans text-white">
      
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0e131f] border border-neutral-800/80 rounded-3xl p-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold font-mono tracking-tight text-white">Active Trip</h1>
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> {currentStatus}
            </span>
          </div>
          <p className="text-xs text-neutral-400 font-mono">
            {trip?.route?.event?.title || 'Event Trip'} · {trip?.route?.originCity} &rarr; {trip?.route?.destination}
          </p>
        </div>

        <button
          onClick={() => router.push('/organizer/dashboard/trips')}
          className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-xl text-xs font-mono font-bold text-neutral-300 transition-all flex items-center gap-2 cursor-pointer w-fit"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Convoys
        </button>
      </div>

      {/* 2. Trip Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Vehicle Card */}
        <div className="bg-[#0e131f] border border-neutral-800/80 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
            <span className="flex items-center gap-1.5"><Truck className="h-4 w-4 text-emerald-400" /> Vehicle</span>
            <span className="font-bold text-white">{vehicleInfo?.type || 'Bus'}</span>
          </div>
          <div className="text-sm font-bold font-mono text-white pt-1">
            {vehicleInfo ? `${vehicleInfo.make} ${vehicleInfo.model}` : 'Unassigned'}
          </div>
          <div className="text-[11px] font-mono text-neutral-400">
            Plate: <strong className="text-emerald-400">{vehicleInfo?.plateNumber || 'Pending'}</strong>
          </div>
        </div>

        {/* Rider Card */}
        <div className="bg-[#0e131f] border border-neutral-800/80 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
            <span className="flex items-center gap-1.5"><User className="h-4 w-4 text-emerald-400" /> Rider</span>
            <span className="text-emerald-400 font-bold">Active</span>
          </div>
          <div className="text-sm font-bold font-mono text-white pt-1">
            {driverInfo ? `${driverInfo.firstName} ${driverInfo.lastName}` : 'Searching Rider...'}
          </div>
          <div className="text-[11px] font-mono text-neutral-400 truncate">
            Tel: {driverInfo?.phoneNumber || 'N/A'}
          </div>
        </div>

        {/* Passengers Card */}
        <div className="bg-[#0e131f] border border-neutral-800/80 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
            <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-emerald-400" /> Passengers</span>
            <span className="text-emerald-400 font-bold">{checkedInCount} / {totalBookings}</span>
          </div>
          <div className="text-xs font-mono text-neutral-300 pt-1 space-y-0.5">
            <div>✓ {checkedInCount} checked in</div>
            <div className="text-neutral-500">○ {totalBookings - checkedInCount} remaining</div>
          </div>
        </div>

        {/* Trip Status Card */}
        <div className="bg-[#0e131f] border border-neutral-800/80 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
            <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-emerald-400" /> Status</span>
            <span className="font-bold text-emerald-400 font-mono">LIVE</span>
          </div>
          <div className="text-sm font-bold font-mono text-white pt-1 uppercase tracking-wider">
            {currentStatus}
          </div>
          <div className="text-[11px] font-mono text-neutral-400">
            ETA: <strong className="text-white">Calculated in transit</strong>
          </div>
        </div>

      </div>

      {/* 3. Live Location Section */}
      <div className="bg-[#0e131f] border border-neutral-800/80 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">Live Vehicle Location (Read-Only)</h3>
          <button 
            onClick={fetchTripDetails}
            className="flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Refresh location
          </button>
        </div>

        <div className="w-full h-80 rounded-2xl overflow-hidden border border-neutral-800 relative z-0">
          {customIcons ? (
            <MapContainer center={[currentVehicleLat, currentVehicleLng]} zoom={13} zoomControl={false} className="w-full h-full">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
              />
              {routeCoordinates.length > 0 && (
                <Polyline positions={routeCoordinates} color="#10b981" weight={5} opacity={0.8} />
              )}
              <Marker position={[targetLat, targetLng]} icon={customIcons.targetDestinationIcon} />
              <Marker position={[currentVehicleLat, currentVehicleLng]} icon={customIcons.vehicleMarkerIcon} />
            </MapContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center font-mono text-xs text-neutral-500">
              Loading map telemetry...
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 pt-1">
          <span>Lat: {currentVehicleLat.toFixed(4)} | Lng: {currentVehicleLng.toFixed(4)}</span>
          <span>Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Just now'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 4. Current Trip Progress Timeline */}
        <div className="bg-[#0e131f] border border-neutral-800/80 rounded-3xl p-6 space-y-4">
          <h3 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">Trip Progress</h3>
          <div className="space-y-3 pt-2">
            {WORKFLOW_STEPS.map((step) => (
              <div key={step.key} className="flex items-center gap-3 text-xs font-mono">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="text-white font-medium">{step.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Passenger Manifest Summary */}
        <div className="bg-[#0e131f] border border-neutral-800/80 rounded-3xl p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">Passenger Manifest</h3>
              <span className="text-xs font-mono text-emerald-400 font-bold">{checkedInCount} / {totalBookings} Checked In</span>
            </div>

            <div className="space-y-2 pt-1">
              <div className="text-[11px] font-mono text-neutral-400 uppercase">Checked In ({checkedInCount})</div>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {trip?.bookings?.filter((b: any) => b.boardingStatus === 'CHECKED_IN' || b.boardingStatus === 'BOARDED').map((b: any) => (
                  <div key={b.id} className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 flex justify-between items-center text-xs">
                    <span className="font-bold text-white">{b.customer?.firstName} {b.customer?.lastName}</span>
                    <span className="text-emerald-400 text-[10px] font-mono">✓ Verified</span>
                  </div>
                ))}
                {checkedInCount === 0 && <p className="text-xs text-neutral-500 italic">No passengers checked in yet.</p>}
              </div>
            </div>
          </div>

          <button
            onClick={() => router.push(`/organizer/dashboard/trips/${tripId}/manifest`)}
            className="w-full mt-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-xl text-xs font-mono font-bold text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            View Full Manifest <ExternalLink className="h-3.5 w-3.5" />
          </button>
        </div>

      </div>

      {/* 6. Pickup Progress & Stations */}
      <div className="bg-[#0e131f] border border-neutral-800/80 rounded-3xl p-6 space-y-4">
        <h3 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">Pickup Points & Coordinates</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {trip?.route?.pickupPoints?.map((point: any) => (
            <div key={point.id} className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
              <div className="font-bold text-xs text-white">{point.name}</div>
              <div className="text-[11px] text-neutral-400 truncate">{point.address}</div>
              {point.landmark && (
                <div className="text-[10px] text-neutral-500 italic">Landmark: {point.landmark}</div>
              )}
              <div className="flex items-center justify-between text-xs font-mono pt-1 border-t border-neutral-900">
                <span className="text-neutral-400">Cap: {point.maxCapacity} seats</span>
                <span className="text-emerald-400 font-bold">Active</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Emergency / Support */}
      <div className="bg-[#0e131f] border border-neutral-800/80 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-xs font-mono font-bold text-white uppercase">Need operational assistance?</h4>
          <p className="text-xs text-neutral-400 font-mono">Contact AviorèGo Support or reach out directly to the assigned driver.</p>
        </div>
        <div className="flex items-center gap-3">
          {driverInfo?.phoneNumber && (
            <a
              href={`tel:${driverInfo.phoneNumber}`}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold font-mono rounded-xl text-xs transition-all flex items-center gap-2"
            >
              <Phone className="h-3.5 w-3.5" /> Contact Rider
            </a>
          )}
          <button
            onClick={() => alert('Redirecting to Aviorè Support desk...')}
            className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-white font-bold font-mono rounded-xl text-xs transition-all cursor-pointer"
          >
            Support Desk
          </button>
        </div>
      </div>

    </div>
  );
}
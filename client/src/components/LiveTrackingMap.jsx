import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import socket from "../socket.js";

// Fix default marker icon paths (common Leaflet + bundler issue)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const LiveTrackingMap = ({ orderId }) => {
  const [riderPosition, setRiderPosition] = useState(null);

  useEffect(() => {
    if (!orderId) return;

    socket.connect();
    socket.emit("join_order", orderId);

    socket.on("location_broadcast", (data) => {
      if (data.orderId === orderId) {
        setRiderPosition([data.lat, data.lng]);
      }
    });

    return () => {
      socket.off("location_broadcast");
      socket.emit("leave_order", orderId);
      socket.disconnect();
    };
  }, [orderId]);

  if (!riderPosition) {
    return (
      <div className="h-80 flex items-center justify-center bg-gray-100 rounded-xl text-gray-500 text-sm">
        Waiting for rider's live location...
      </div>
    );
  }

  return (
    <MapContainer
      center={riderPosition}
      zoom={15}
      className="h-80 w-full rounded-xl z-0"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      <Marker position={riderPosition}>
        <Popup>Rider is here</Popup>
      </Marker>
    </MapContainer>
  );
};

export default LiveTrackingMap;

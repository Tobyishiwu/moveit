import { useEffect } from "react";
import socket from "../socket.js";

const RiderLocationBroadcaster = ({ orderId }) => {
  useEffect(() => {
    if (!orderId) return;

    socket.connect();
    socket.emit("join_order", orderId);

    let watchId;
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          socket.emit("rider_location_update", {
            orderId,
            lat: latitude,
            lng: longitude,
          });
        },
        (error) => console.error(`Geolocation error [code ${error.code}]: ${error.message}`),
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 20000 }
      );
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
      socket.emit("leave_order", orderId);
      socket.disconnect();
    };
  }, [orderId]);

  return (
    <div className="bg-green-50 text-green-700 text-sm rounded-lg px-3 py-2">
      📍 Sharing live location for this delivery
    </div>
  );
};

export default RiderLocationBroadcaster;


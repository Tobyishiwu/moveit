export const initSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("join_order", (orderId) => {
      socket.join(`order_${orderId}`);
      console.log(`Socket ${socket.id} joined order_${orderId}`);
    });

    socket.on("rider_location_update", ({ orderId, lat, lng }) => {
      console.log(`Location update for order_${orderId}: ${lat}, ${lng}`);
      socket.to(`order_${orderId}`).emit("location_broadcast", {
        orderId,
        lat,
        lng,
        timestamp: Date.now(),
      });
    });

    socket.on("leave_order", (orderId) => {
      socket.leave(`order_${orderId}`);
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};

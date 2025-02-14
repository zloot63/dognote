export const calculateDistance = (routes: { lat: number; lng: number }[]) => {
    let totalDistance = 0;

    for (let i = 1; i < routes.length; i++) {
        const prev = routes[i - 1];
        const curr = routes[i];
        
        const R = 6371e3; // 지구 반지름 (미터 단위)
        const φ1 = (prev.lat * Math.PI) / 180;
        const φ2 = (curr.lat * Math.PI) / 180;
        const Δφ = ((curr.lat - prev.lat) * Math.PI) / 180;
        const Δλ = ((curr.lng - prev.lng) * Math.PI) / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                  Math.cos(φ1) * Math.cos(φ2) *
                  Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        totalDistance += R * c;
    }

    return Math.round(totalDistance); // ✅ 거리 (미터 단위)
};

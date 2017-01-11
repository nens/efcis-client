import L from 'leaflet';

export default function pointAlongLine(p, a, b) {
  const diffPA = {
    lat: p.lat - a.lat,
    lng: p.lng - a.lng,
  };
  const diffAB = {
    lat: b.lat - a.lat,
    lng: b.lng - a.lng,
  };

  const ab2 = diffAB.lat * diffAB.lat + diffAB.lng * diffAB.lng;
  const apAb = diffPA.lat * diffAB.lat + diffPA.lng * diffAB.lng;
  let t = apAb / ab2;
  if (t < 0) {
    t = 0;
  }
  if (t > 1) {
    t = 1;
  }
  const closest = new L.LatLng(
    a.lat + diffAB.lat * t,
    a.lng + diffAB.lng * t
  );
  return closest;
}

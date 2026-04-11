import scooter from '../assets/scooter.png';
import home from '../assets/home.png';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet';
const deliveryPartnerIcon = new L.Icon({
  iconUrl: scooter,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});
const customerIcon = new L.Icon({
  iconUrl: home,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

function DeliveryTracking({ data }) {
  const customerLat = data?.customerLocation?.lat;
  const customerlon = data?.customerLocation?.lon;
  const deliveryPartnerLat = data?.deliveryPartnerLocation?.lat;
  const deliveryPartnerlon = data?.deliveryPartnerLocation?.lon;
  console.log(customerLat, customerlon)
  if (!customerLat || !customerlon || !deliveryPartnerLat || !deliveryPartnerlon) return null;
  const path = [
    [deliveryPartnerLat, deliveryPartnerlon],
    [customerLat, customerlon],
  ];

  const center = [(deliveryPartnerLat + customerLat) / 2, (deliveryPartnerlon + customerlon) / 2];

  return (
    <div className="w-full h-70 mt-3 rounded-xl overflow-hidden shadow-md">
      <MapContainer className={'w-full h-full'} center={center} zoom={16}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[deliveryPartnerLat, deliveryPartnerlon]} icon={deliveryPartnerIcon}>
          <Popup>Delivery Partner Location</Popup>
        </Marker>
        <Marker position={[customerLat, customerlon]} icon={customerIcon}>
          <Popup>Delivery Address</Popup>
        </Marker>

        <Polyline positions={path} color="blue" weight={4} />
      </MapContainer>
    </div>
  );
}

export default DeliveryTracking;

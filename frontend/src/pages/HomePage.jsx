import { useSelector } from 'react-redux';
import UserDashboard from '../components/UserDashboard';
import VendorDashboard from '../components/VendorDashboard';
import DeliveryPartnerDashboard from '../components/DeliveryPartnerDashboard';

function HomePage() {
  const { userData } = useSelector((state) => state.user);

  const isUser = userData?.role === 'user';
  const isVendor = userData?.role === 'vendor';
  const isDeliveryPartner = userData?.role === 'deliveryPartner';
  
  return (
    <div className="bg-[#f4f4f2] w-full min-h-screen pt-[60px] overflow-x-hidden">
      {isUser && <UserDashboard />}
      {isVendor && <VendorDashboard />}
      {isDeliveryPartner && <DeliveryPartnerDashboard />}
    </div>
  );
}

export default HomePage;

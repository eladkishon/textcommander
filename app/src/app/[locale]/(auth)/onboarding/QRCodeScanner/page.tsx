import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchQRCode = async () => {
  const response = await axios.get(process.env.NEXT_PUBLIC_APP_URL + "/qr-code");

  return response.data;
};

const QRCodeScanner = () => {
  const { data, isLoading, isError } = useQuery({
    queryFn: async () => await fetchQRCode(),
    queryKey: ["qrCode"],
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return (
      <div>
        <p>Failed to load QR code. Please try again.</p>
        <button onClick={fetchQRCode}>Retry</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Scan the QR Code</h1>
      {data.qrCode ? (
        <img src={data.qrCode} alt="QR Code" style={{ width: 300, height: 300 }} />
      ) : (
        <p>QR code not available yet. Please wait...</p>
      )}
    </div>
  );
};

export default QRCodeScanner;

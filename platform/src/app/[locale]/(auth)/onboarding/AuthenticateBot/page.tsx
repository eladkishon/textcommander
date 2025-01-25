// "use client"
// import { Button } from "@/components/ui/button";
// import { useMutation } from "@tanstack/react-query";
// import { useState } from "react";
// import QRCode from "react-qr-code";

// const AuthenticateBot = ({ userId }: { userId: string }) => {
//   const [isPollingQrEnabled, setIsPollingQrEnabled] = useState(false);
//   const [isStartingBotEnabled, setIsStartingBotEnabled] = useState(true);

//   const onConnect = () => {
//     setIsStartingBotEnabled(false);
//     startBotMutate.mutate();
//   };

//   const {
//     data: qrCode,
//     isLoading: isQRCodeLoading,
//     isFetching: isQRCodeFetching,
//   } = useFetchQRCode(userId, isPollingQrEnabled);

//   const startBotMutate = useMutation({
//     mutationFn: () => startBot(userId),
//     onSuccess: () => {
//       setIsPollingQrEnabled(true);
//     },
//     onError: (error) => {
//       console.error("Failed to start bot", error);
//       setIsStartingBotEnabled(true);
//     },
//   });

//   return (
//     <div>
//       <Button onClick={onConnect} disabled={!isStartingBotEnabled}>
//         Connect
//       </Button>

//       {qrCode && (
//         <div className="pt-4">
//           <QRCode size={100} value={qrCode} />
//         </div>
//       )}

//       {(isQRCodeLoading || isQRCodeFetching) && <p>Loading QR code...</p>}
//     </div>
//   );
// };

// export default AuthenticateBot;

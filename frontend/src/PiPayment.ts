// SIL Ltd - SNI Mainnet Payment Logic
export const onReadyForServerSideVerification = (_paymentId: string) => {
  console.log("Payment ready for server-side audit.");
};
export const onReadyForServerSideApproval = (_paymentId: string) => {
  console.log("Payment approved by Chronos.");
};
export const onCancel = (_paymentId: string) => {
  console.log("Payment cancelled.");
};
export const onError = (_error: any, _payment?: any) => {
  console.error("SNI Payment Error detected.");
};

import { Toaster } from "react-hot-toast";

export const ToastContainer = () => {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, zIndex: 100000 }}>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            zIndex: 100001,
            fontSize: '16px',
            fontWeight: 'bold',
          },
        }}
      />
    </div>
  );
};
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TentForm from "./formComponent/TentForm";
import NavBar from "./component/NavBar";
import { TentProvider } from "./store/Store";
import ThankYouPage from "./component/ThankYouPage";
import DownloadReceipt from "./component/DownloadReceipt";
import BookTent from "./bookingComponent/BookTent";
import RedirectComponent from "./redirectComponent/RedirectComponent";
import RetryPayment from "./component/RetryPayment";

const App: React.FC = () => {
  return (
    <>
      <TentProvider>
        <BrowserRouter>
          <NavBar />
          <div>
            <Routes>
              <Route path="/book-tent" element={<BookTent />} />
              <Route path="/tent-form" element={<TentForm />} />
              <Route path="/thank-you-page" element={<ThankYouPage />} />
              <Route path="/retry-payment" element={<RetryPayment />} />
              <Route path="/download-receipt" element={<DownloadReceipt />} />
              <Route path="/redirect-page" element={<RedirectComponent />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TentProvider>
    </>
  );
};

export default App;

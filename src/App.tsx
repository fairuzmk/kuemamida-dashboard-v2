import { BrowserRouter as Router, Routes, Route } from "react-router";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import AddProduct from "./pages/AddProduct/AddProduct";
import ListProduct from "./pages/ListProduct/ListProduct";
import OrderPage from "./pages/Order/OrderPage";
import { ToastContainer} from 'react-toastify';
import EditProduct from "./pages/EditProduct/EditProduct";
import { UrlContext } from "./context/UrlContext";
import AddCustomProduct from "./pages/AddCustomProduct/AddCustomProduct";
import ListCustomProduct from "./pages/ListCustomProduct/ListCustomProduct";
import InvoiceCustom from "./pages/InvoiceCustom/InvoiceCustom";
import EditCustomProduct from "./pages/EditCustomProduct/EditCustomProduct";

export default function App() {
  
  // const urlServer = "http://localhost:4000";
  const urlServer = "https://kuemamida-backend.onrender.com";

  return (
    
    <>
    <UrlContext.Provider value={urlServer}>
      <Router>
        <ScrollToTop />
        <ToastContainer position="bottom-right"/>
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />

            {/* Add Products */}
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/add-custom-product" element={<AddCustomProduct />} />
            
            {/* Edit Products */}
            <Route path="/edit-product/:id" element={<EditProduct />} />
            <Route path="/edit-custom-product/:id" element={<EditCustomProduct />} />

            {/* List Products */}
            <Route path="/list-product" element={<ListProduct />} />
            <Route path="/list-custom-product" element={<ListCustomProduct />} />
            <Route path="/invoice-custom/:id" element={<InvoiceCustom />} />
            <Route path="/data-custom-order" element={<ListProduct />} />

            {/* Orders */}
            <Route path="/orders" element={<OrderPage/>} />









            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>


          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      </UrlContext.Provider>
    </>
  );
}

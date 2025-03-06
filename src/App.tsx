import "./App.css";
import Layout from "./layout/Layout";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Giveaway from "./pages/Giveaway";
import Login from "./pages/Login";
import Archive from "./pages/Archive";
import Me from "./pages/Me";
import ProtectedRoute from "./routes/ProtectedRoute";
import Challange from "./pages/Challenge";
import { useUser } from "@/context/UserContext";
import Shorts from "./pages/Shorts";
import Management from "./pages/Management";

function App() {
  const { user } = useUser();
  console.log("App", user);
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/giveaway" element={<Giveaway />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/login" element={<Login />} />
        <Route path="/challenge" element={<Challange />} />
        <Route path="/clips" element={<Shorts />} />
        <Route
          path="/me"
          element={
            <ProtectedRoute isAuthenticated={!!user}>
              <Me />
            </ProtectedRoute>
          }
        />
        <Route path="/management" element={<Management />} />
      </Routes>
    </Layout>
  );
}

export default App;

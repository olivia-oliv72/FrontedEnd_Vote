import { Router, Route } from "@solidjs/router";

import Home from "./pages/guest/home/Home";
import Login from "./pages/guest/Login";
// import Register from "./pages/guest/Register";

import Voting from "./pages/voter/Voting";
import Confirmation from "./pages/voter/Confirmation";
// import Profile from "./pages/voter/Profile";

import AdminDashboard from "./pages/admin/Dashboard";
// import AddCategory from "./pages/admin/AddCategory";
// import EditCategory from "./pages/admin/EditCategory";

function App() {
  return (
    <Router>
      {/* Halaman umum */}
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/voting/:categoryId" component={Voting} />
      <Route path="/confirmation/:categoryId" component={Confirmation} />
      <Route path="/admin" component={AdminDashboard} />

    </Router>
  );
}

export default App;
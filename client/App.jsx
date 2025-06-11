import { Router, Route } from "@solidjs/router";

import Home from "./pages/guest/home/Home";
import Login from "./pages/guest/Login";

import Voting from "./pages/voter/Voting";
import Confirmation from "./pages/voter/Confirmation";
import Profile from "./pages/voter/Profile";
import Logout from "./pages/voter/Logout";

import AdminDashboard from "./pages/admin/Dashboard";
import AddCategory from "./pages/admin/AddCategory";
import EditCategory from "./pages/admin/EditCategory";

import ProtectedRoute from "./components/ProtectedRoute";
import NotFoundRedirect from "./components/NotFoundRedirect";

function App() {
  console.log("App is running")
  return (
    <>
      <Router>
        {/* Public */}
        <Route path="/login" component={Login} />
        <Route path="/logout" component={Logout} />

        {/* Public, User */}
        <Route
          path="/"
          component={() => (
            <ProtectedRoute disallowedRoles={["admin"]}>
              <Home />
            </ProtectedRoute>
          )}
        />

        {/* Admin */}
        <Route
          path="/admin"
          component={() => (
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/add-category/:categoryId"
          component={() => (
            <ProtectedRoute allowedRoles={["admin"]}>
              <AddCategory />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/admin/edit-category/:categoryId"
          component={() => (
            <ProtectedRoute allowedRoles={["admin"]}>
              <EditCategory />
            </ProtectedRoute>
          )}
        />

        {/* User */}
        <Route
          path="/history"
          component={() => (
            <ProtectedRoute allowedRoles={["user"]}>
              <Profile />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/voting/:categoryId"
          component={() => (
            <ProtectedRoute allowedRoles={["user"]}>
              <Voting />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/confirmation/:categoryId/:candidateId"
          component={() => (
            <ProtectedRoute allowedRoles={["user"]}>
              <Confirmation />
            </ProtectedRoute>
          )}
        />
        <Route
          path="*"
          component={NotFoundRedirect}
        />
      </Router>
    </>
  );
}

export default App;
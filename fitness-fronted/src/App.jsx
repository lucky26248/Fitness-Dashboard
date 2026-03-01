import { Box, Button } from "@mui/material";
import { useContext, useEffect } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import ActivityDetail from "./components/ActivityDetail";
import ActivityForm from "./components/ActivityForm";
import ActivityList from "./components/ActivityList";
import { setCredentials } from "./store/authSlice";

const ActivitiesPage = () => {
  return (
    <>
      <ActivityForm onActivityAdded={() => window.location.reload()} />
      <ActivityList />
    </>
  );
};

function App() {
  const { token, tokenData, logIn, logOut } = useContext(AuthContext);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      dispatch(setCredentials({ token, user: tokenData }));
    }
  }, [token, tokenData, dispatch]);

  return (
    <Router>
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #1e3c72, #2a5298)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 2,
        }}
      >
        {!token ? (
          <Button
            variant="contained"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              fontWeight: "bold",
              borderRadius: "12px",
              background: "white",
              color: "#2a5298",
              "&:hover": {
                background: "#f2f2f2",
              },
            }}
            onClick={() => logIn()}
          >
            🔐 LOGIN
          </Button>
        ) : (
          <Box
            sx={{
              width: "100%",
              maxWidth: 1200,
              background: "#ffffff",
              borderRadius: "20px",
              p: 4,
              boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 3,
              }}
            >
              <Box
                sx={{
                  fontSize: "22px",
                  fontWeight: "bold",
                  color: "#1e3c72",
                }}
              >
                🏋️ Fitness Dashboard
              </Box>

              <Button
                variant="contained"
                color="error"
                sx={{ borderRadius: "10px" }}
                onClick={() => logOut()}
              >
                LOGOUT
              </Button>
            </Box>

            <Routes>
              <Route path="/activities" element={<ActivitiesPage />} />
              <Route path="/activities/:id" element={<ActivityDetail />} />
              <Route path="/" element={<Navigate to="/activities" replace />} />
            </Routes>
          </Box>
        )}
      </Box>
    </Router>
  );
}

export default App;
import React, { useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import { addActivity } from "../services/api";

const ActivityForm = ({ onActivityAdded }) => {
  const [activity, setActivity] = useState({
    type: "RUNNING",
    duration: "",
    caloriesBurned: "",
    additionalMetrics: {},
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addActivity(activity);
    onActivityAdded();
    setActivity({
      type: "RUNNING",
      duration: "",
      caloriesBurned: "",
      additionalMetrics: {},
    });
  };

  return (
    <Card sx={{ mb: 4, borderRadius: "18px", boxShadow: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          ➕ Add New Activity
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Activity Type</InputLabel>
            <Select
              value={activity.type}
              label="Activity Type"
              onChange={(e) =>
                setActivity({ ...activity, type: e.target.value })
              }
            >
              <MenuItem value="RUNNING">RUNNING</MenuItem>
              <MenuItem value="WALKING">WALKING</MenuItem>
              <MenuItem value="CYCLING">CYCLING</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Duration (minutes)"
            type="number"
            sx={{ mb: 2 }}
            value={activity.duration}
            onChange={(e) =>
              setActivity({ ...activity, duration: e.target.value })
            }
          />

          <TextField
            fullWidth
            label="Calories Burned"
            type="number"
            sx={{ mb: 2 }}
            value={activity.caloriesBurned}
            onChange={(e) =>
              setActivity({ ...activity, caloriesBurned: e.target.value })
            }
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 2,
              py: 1.5,
              borderRadius: "12px",
              background: "linear-gradient(45deg, #00c6ff, #0072ff)",
              fontWeight: "bold",
            }}
          >
            🚀 Add Activity
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ActivityForm;
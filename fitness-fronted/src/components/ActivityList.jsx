import { Card, CardContent, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getActivities } from "../services/api";

const ActivityList = ({ refresh }) => {
  const [activities, setActivities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadActivities = async () => {
      const response = await getActivities();
      setActivities(response.data);
    };
    loadActivities();
  }, [refresh]);

  if (!activities.length) {
    return <Typography>No activities found</Typography>;
  }

  return (
    <Grid container spacing={3}>
      {activities.map((activity) => (
        <Grid item xs={12} sm={6} md={4} key={activity.id}>
          <Card
            sx={{
              cursor: "pointer",
              borderRadius: "18px",
              transition: "0.3s",
              boxShadow: 3,
              "&:hover": {
                transform: "translateY(-8px)",
                boxShadow: 8,
              },
            }}
            onClick={() => navigate(`/activities/${activity.id}`)}
          >
            <CardContent>
              <Typography variant="h6">
                🏃 {activity.type}
              </Typography>
              <Typography>
                ⏱ {activity.duration} min
              </Typography>
              <Typography>
                🔥 {activity.caloriesBurned} kcal
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ActivityList;
import {
  Box,
  Card,
  CardContent,
  Divider,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getActivityDetails } from "../services/api";

const ActivityDetail = () => {
  const { id } = useParams();
  const [recommendation, setRecommendation] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      const response = await getActivityDetails(id);
      setRecommendation(response.data);
    };
    fetchDetails();
  }, [id]);

  if (!recommendation) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 900, margin: "auto" }}>
      <Card sx={{ borderRadius: "20px", boxShadow: 5 }}>
        <CardContent>
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", color: "#2a5298" }}
          >
            🤖 AI Recommendation
          </Typography>

          <Chip
            label={recommendation.type}
            sx={{ my: 2 }}
            color="primary"
          />

          <Typography sx={{ whiteSpace: "pre-line" }}>
            {recommendation.recommendation}
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6">📈 Improvements</Typography>
          <List>
            {recommendation.improvements?.map((item, index) => (
              <ListItem key={index}>
                <ListItemText primary={`✔ ${item}`} />
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6">🏋️ Suggestions</Typography>
          <List>
            {recommendation.suggestions?.map((item, index) => (
              <ListItem key={index}>
                <ListItemText primary={`✔ ${item}`} />
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 3 }} />

          <Typography variant="caption" color="text.secondary">
            Generated on:{" "}
            {new Date(recommendation.createdAt).toLocaleString()}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ActivityDetail;
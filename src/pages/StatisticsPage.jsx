import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { logEvent } from "../utils/logger"; // ✅ Import the logger

const StatisticsPage = () => {
  const [links, setLinks] = useState([]);

  useEffect(() => {
    const storedLinks = JSON.parse(localStorage.getItem("shortLinks")) || [];
    setLinks(storedLinks);

    // ✅ Log statistics page visit
    logEvent(`User visited statistics page. Loaded ${storedLinks.length} URLs.`, "info", "frontend", "statistics");
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Shortened URLs Statistics
      </Typography>

      {links.length === 0 ? (
        <Typography>No data found.</Typography>
      ) : (
        links.map((link, index) => (
          <Card key={index} sx={{ my: 2 }}>
            <CardContent>
              <Typography variant="h6">
                Short URL: http://localhost:3000/{link.shortcode}
              </Typography>
              <Typography>Original URL: {link.originalUrl}</Typography>
              <Typography>Created At: {new Date(link.createdAt).toLocaleString()}</Typography>
              <Typography>Expires At: {new Date(link.expiresAt).toLocaleString()}</Typography>
              <Typography>Total Clicks: {link.clicks?.length || 0}</Typography>

              {link.clicks?.length > 0 && (
                <>
                  <Typography variant="subtitle1" mt={2}>Click Details:</Typography>
                  <List>
                    {link.clicks.map((click, idx) => (
                      <React.Fragment key={idx}>
                        <ListItem alignItems="flex-start">
                          <ListItemText
                            primary={`Time: ${new Date(click.timestamp).toLocaleString()}`}
                            secondary={`Source: ${click.source}, Location: ${click.location}`}
                          />
                        </ListItem>
                        <Divider component="li" />
                      </React.Fragment>
                    ))}
                  </List>
                </>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </Container>
  );
};

export default StatisticsPage;

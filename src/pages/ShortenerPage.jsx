import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Snackbar,
  Alert,
} from "@mui/material";
import { logEvent } from "../utils/logger"; // ✅ Import logger

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
};

const generateRandomCode = () => {
  return Math.random().toString(36).substring(2, 8);
};

const ShortenerPage = () => {
  const [inputs, setInputs] = useState([
    { originalUrl: "", validity: "", shortcode: "" },
  ]);
  const [results, setResults] = useState([]);
  const [alert, setAlert] = useState({ open: false, message: "", severity: "info" });

  const handleInputChange = (index, field, value) => {
    const updated = [...inputs];
    updated[index][field] = value;
    setInputs(updated);
  };

  const addMoreInput = () => {
    if (inputs.length < 5) {
      setInputs([...inputs, { originalUrl: "", validity: "", shortcode: "" }]);
    }
  };

  const handleShorten = async () => {
    let allLinks = JSON.parse(localStorage.getItem("shortLinks")) || [];
    const newResults = [];

    for (let i = 0; i < inputs.length; i++) {
      const { originalUrl, validity, shortcode } = inputs[i];

      if (!originalUrl || !isValidUrl(originalUrl)) {
        setAlert({ open: true, message: `Invalid URL at row ${i + 1}`, severity: "error" });
        return;
      }

      let finalCode = shortcode.trim() || generateRandomCode();

      const shortcodeRegex = /^[a-zA-Z0-9_-]{3,15}$/;
      if (shortcode && !shortcodeRegex.test(finalCode)) {
        setAlert({ open: true, message: `Invalid shortcode at row ${i + 1}. Use 3-15 alphanumeric characters only.`, severity: "error" });
        return;
      }

      const isDuplicate = allLinks.some((l) => l.shortcode === finalCode);
      if (isDuplicate) {
        setAlert({ open: true, message: `Shortcode '${finalCode}' already exists at row ${i + 1}`, severity: "error" });
        return;
      }

      const minutes = parseInt(validity);
      const isValidMinutes = !validity || (!isNaN(minutes) && minutes > 0);
      if (!isValidMinutes) {
        setAlert({ open: true, message: `Invalid validity at row ${i + 1}`, severity: "error" });
        return;
      }

      const createdAt = new Date();
      const expiresAt = new Date(createdAt.getTime() + (minutes || 30) * 60000);

      const newLink = {
        originalUrl,
        shortcode: finalCode,
        createdAt,
        expiresAt,
        clicks: [],
      };

      allLinks.push(newLink);
      newResults.push(newLink);

      // ✅ Log the shortening event
      await logEvent(`Shortened URL from ${originalUrl} → ${finalCode}`, "info", "frontend", "shortener");
    }

    localStorage.setItem("shortLinks", JSON.stringify(allLinks));
    setResults(newResults);
    setAlert({ open: true, message: "Shortened successfully!", severity: "success" });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        URL Shortener Page
      </Typography>

      {inputs.map((input, index) => (
        <Card key={index} sx={{ marginBottom: 2 }}>
          <CardContent>
            <Typography variant="h6">URL #{index + 1}</Typography>
            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Original URL"
                  fullWidth
                  value={input.originalUrl}
                  onChange={(e) => handleInputChange(index, "originalUrl", e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Validity (min)"
                  fullWidth
                  value={input.validity}
                  onChange={(e) => handleInputChange(index, "validity", e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Custom Shortcode"
                  fullWidth
                  value={input.shortcode}
                  onChange={(e) => handleInputChange(index, "shortcode", e.target.value)}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}

      <Button variant="outlined" onClick={addMoreInput} disabled={inputs.length >= 5}>
        Add More (max 5)
      </Button>

      <Button variant="contained" color="primary" onClick={handleShorten} sx={{ ml: 2 }}>
        Shorten URLs
      </Button>

      <Typography variant="h5" mt={4} gutterBottom>
        Results:
      </Typography>
      {results.map((res, idx) => (
        <Card key={idx} sx={{ my: 1 }}>
          <CardContent>
            <Typography>Original URL: {res.originalUrl}</Typography>
            <Typography>Short URL: http://localhost:3000/{res.shortcode}</Typography>
            <Typography>Expires At: {new Date(res.expiresAt).toLocaleString()}</Typography>
          </CardContent>
        </Card>
      ))}

      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert severity={alert.severity}>{alert.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default ShortenerPage;

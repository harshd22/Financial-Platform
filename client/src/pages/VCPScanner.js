import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from '@mui/material';
import { createChart } from 'lightweight-charts';

function VCPScanner() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [parameters, setParameters] = useState({
    minVolume: 100000,
    minPrice: 5,
    maxPrice: 1000,
    contractionPeriod: 20,
    volumeThreshold: 0.5,
  });

  const handleParameterChange = (e) => {
    setParameters({
      ...parameters,
      [e.target.name]: parseFloat(e.target.value),
    });
  };

  const handleScan = async () => {
    setLoading(true);
    try {
      // TODO: Implement actual API call to backend
      // This is a mock response for demonstration
      const mockResults = [
        {
          symbol: 'AAPL',
          price: 150.25,
          volume: 5000000,
          contraction: 15,
          pattern: 'VCP',
          score: 0.85,
        },
        {
          symbol: 'MSFT',
          price: 280.75,
          volume: 3000000,
          contraction: 18,
          pattern: 'VCP',
          score: 0.78,
        },
      ];
      setResults(mockResults);
    } catch (error) {
      console.error('Error scanning for VCP patterns:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        VCP Scanner
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Scan for Volatility Contraction Patterns (VCP) in stocks based on your criteria.
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Minimum Volume"
              name="minVolume"
              type="number"
              value={parameters.minVolume}
              onChange={handleParameterChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Minimum Price"
              name="minPrice"
              type="number"
              value={parameters.minPrice}
              onChange={handleParameterChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Maximum Price"
              name="maxPrice"
              type="number"
              value={parameters.maxPrice}
              onChange={handleParameterChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Contraction Period (days)"
              name="contractionPeriod"
              type="number"
              value={parameters.contractionPeriod}
              onChange={handleParameterChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Volume Threshold"
              name="volumeThreshold"
              type="number"
              value={parameters.volumeThreshold}
              onChange={handleParameterChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleScan}
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Scan for VCP Patterns'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {results.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Symbol</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Volume</TableCell>
                <TableCell align="right">Contraction Days</TableCell>
                <TableCell align="right">Pattern</TableCell>
                <TableCell align="right">Score</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.map((row) => (
                <TableRow key={row.symbol}>
                  <TableCell component="th" scope="row">
                    {row.symbol}
                  </TableCell>
                  <TableCell align="right">${row.price.toFixed(2)}</TableCell>
                  <TableCell align="right">{row.volume.toLocaleString()}</TableCell>
                  <TableCell align="right">{row.contraction}</TableCell>
                  <TableCell align="right">{row.pattern}</TableCell>
                  <TableCell align="right">{(row.score * 100).toFixed(1)}%</TableCell>
                  <TableCell align="right">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {/* TODO: Implement chart view */}}
                    >
                      View Chart
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export default VCPScanner; 
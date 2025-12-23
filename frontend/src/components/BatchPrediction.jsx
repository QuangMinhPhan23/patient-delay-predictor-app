import React, { useState } from 'react';
import { Users, Upload, Download, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './Card';
import { Button } from './Button';
import { getBatchPrediction } from '../lib/api';

const BatchPrediction = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [batchData, setBatchData] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target.result);
          setBatchData(JSON.stringify(json, null, 2));
          setError(null);
        } catch (err) {
          setError('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const data = JSON.parse(batchData);
      const result = await getBatchPrediction(data);
      setResults(result);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to get predictions');
    } finally {
      setLoading(false);
    }
  };

  const loadSampleData = () => {
    const sample = [
      {
        age: 75.0,
        addelassess: 1.0,
        frailty: 2.0,
        cogassess: 1.0,
        cogstat: 1.0,
        walk: 2.0,
        uresidence: 1.0,
        ftype: 1.0,
        side: 2.0,
        afracture: 1.0,
        ptype: 1.0,
        anaesth: 1.0,
        wbear: 1.0,
        pulcers: 1.0,
        malnutrition: 1.0,
        delay: 1.0
      },
      {
        age: 80.0,
        addelassess: 2.0,
        frailty: 3.0,
        cogassess: 2.0,
        cogstat: 2.0,
        walk: 3.0,
        uresidence: 2.0,
        ftype: 2.0,
        side: 1.0,
        afracture: 2.0,
        ptype: 2.0,
        anaesth: 2.0,
        wbear: 2.0,
        pulcers: 2.0,
        malnutrition: 2.0,
        delay: 2.0
      }
    ];
    setBatchData(JSON.stringify(sample, null, 2));
    setError(null);
  };

  const downloadResults = () => {
    if (!results) return;
    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'batch_predictions.json';
    link.click();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Users className="h-6 w-6 text-primary" />
            <CardTitle>Batch Prediction</CardTitle>
          </div>
          <CardDescription>
            Upload or paste JSON data for multiple patient predictions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button type="button" variant="outline" className="w-full" asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload JSON File
                  </span>
                </Button>
              </label>
            </div>
            <Button variant="secondary" onClick={loadSampleData}>
              Load Sample Data
            </Button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Patient Data (JSON Array)</label>
            <textarea
              value={batchData}
              onChange={(e) => setBatchData(e.target.value)}
              placeholder="Paste JSON array of patient data here..."
              className="w-full h-64 p-3 border rounded-md font-mono text-sm"
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={loading || !batchData}
            className="w-full"
          >
            {loading ? 'Processing...' : 'Get Batch Predictions'}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <p className="font-medium">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {results && (
        <Card className="border-green-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <CardTitle>Batch Results</CardTitle>
              </div>
              <Button variant="outline" size="sm" onClick={downloadResults}>
                <Download className="h-4 w-4 mr-2" />
                Download Results
              </Button>
            </div>
            <CardDescription>
              {results.total} predictions completed successfully
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {results.predictions.map((pred, idx) => (
                <div
                  key={idx}
                  className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Patient {pred.patient_index + 1}</span>
                    <span className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-bold">
                      Class {pred.predicted_class}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    {Object.entries(pred.probabilities).map(([className, prob]) => (
                      <div key={className} className="flex justify-between">
                        <span className="text-muted-foreground capitalize">
                          {className.replace('_', ' ')}:
                        </span>
                        <span className="font-medium">{(prob * 100).toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BatchPrediction;

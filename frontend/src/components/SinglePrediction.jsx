import React, { useState } from 'react';
import { Activity, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './Card';
import { Button } from './Button';
import { Input } from './Input';
import { getSinglePrediction } from '../lib/api';

const SinglePrediction = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  
  const getClassLabel = (className) => {
    const labels = {
      'class_0': 'Delirium Not Assessed',
      'class_1': 'Assessed - No Delirium Identified',
      'class_2': 'Assessed - Delirium Identified'
    };
    return labels[className] || className;
  };
  
  const [formData, setFormData] = useState({
    age: '',
    addelassess: '',
    frailty: '',
    cogassess: '',
    cogstat: '',
    walk: '',
    uresidence: '',
    ftype: '',
    side: '',
    afracture: '',
    ptype: '',
    anaesth: '',
    wbear: '',
    pulcers: '',
    malnutrition: '',
    delay: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: parseFloat(e.target.value) || ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await getSinglePrediction(formData);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to get prediction');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'age', label: 'Age' },
    { name: 'addelassess', label: 'Delirium Assessment Prior To Surgery' },
    { name: 'frailty', label: 'Clinical Frailty Scale' },
    { name: 'cogassess', label: 'Pre-admission Cognitive Assessment' },
    { name: 'cogstat', label: 'Pre-admission Cognitive Status' },
    { name: 'walk', label: 'Pre-admission Walking Ability' },
    { name: 'uresidence', label: 'Usual Place of Residence' },
    { name: 'ftype', label: 'Type of Fracture' },
    { name: 'side', label: 'Side of Hip Fracture' },
    { name: 'afracture', label: 'Atypical Fracture' },
    { name: 'ptype', label: 'Patient Type' },
    { name: 'anaesth', label: 'Type of Anaesthesia' },
    { name: 'wbear', label: 'Postoperative Weight Bearing Status' },
    { name: 'pulcers', label: 'New Skin Pressure Injuries' },
    { name: 'malnutrition', label: 'Clinical Malnutrition Assessment' },
    { name: 'delay', label: 'Surgery Delay' }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Activity className="h-6 w-6 text-primary" />
            <CardTitle>Single Patient Prediction</CardTitle>
          </div>
          <CardDescription>
            Enter patient pre-operative characteristics to predict post-operative delirium assessment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {fields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <label className="text-sm font-medium" htmlFor={field.name}>
                    {field.label}
                  </label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="number"
                    step="any"
                    value={formData[field.name]}
                    onChange={handleChange}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    required
                  />
                </div>
              ))}
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Predicting...' : 'Get Prediction'}
            </Button>
          </form>
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

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-green-500">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <CardTitle>Prediction Result</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
                  <span className="text-sm font-medium">Predicted Class</span>
                  <span className="text-2xl font-bold text-primary">
                    {result.predicted_label}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium">Class {result.predicted_class}</p>
                  <p>{result.message}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                <CardTitle>Class Probabilities</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(result.probabilities).map(([className, prob]) => (
                  <div key={className} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">
                        {getClassLabel(className)}
                      </span>
                      <span className="text-muted-foreground">
                        {(prob * 100).toFixed(2)}%
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${prob * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SinglePrediction;

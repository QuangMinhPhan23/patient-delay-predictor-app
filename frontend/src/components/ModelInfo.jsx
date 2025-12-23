import React, { useState, useEffect } from 'react';
import { Info, BarChart3, Brain, Layers, TrendingUp, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './Card';
import { Button } from './Button';
import { getModelInfo } from '../lib/api';

const ModelInfo = () => {
  const [loading, setLoading] = useState(false);
  const [modelInfo, setModelInfo] = useState(null);
  const [error, setError] = useState(null);

  const fetchModelInfo = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getModelInfo();
      setModelInfo(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch model info');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModelInfo();
  }, []);

  const MetricCard = ({ icon: Icon, title, value, color = "text-primary" }) => (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className={`text-2xl font-bold ${color}`}>
              {typeof value === 'number' ? value.toFixed(4) : value || 'N/A'}
            </p>
          </div>
          <Icon className={`h-8 w-8 ${color}`} />
        </div>
      </CardContent>
    </Card>
  );

  if (loading && !modelInfo) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading model information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2 text-destructive">
            <Info className="h-5 w-5" />
            <p className="font-medium">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!modelInfo) return null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-primary" />
              <CardTitle>Model Architecture</CardTitle>
            </div>
            <Button variant="outline" size="sm" onClick={fetchModelInfo}>
              Refresh
            </Button>
          </div>
          <CardDescription>
            Stacking ensemble model configuration and details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-primary/10 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Layers className="h-5 w-5 text-primary" />
                <span className="font-medium">Model Type</span>
              </div>
              <p className="text-sm text-muted-foreground">{modelInfo.model_type}</p>
            </div>

            <div className="p-4 bg-secondary rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <span className="font-medium">Base Estimators</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {modelInfo.base_estimators?.join(', ')}
              </p>
            </div>

            <div className="p-4 bg-accent rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="h-5 w-5 text-primary" />
                <span className="font-medium">Meta Learner</span>
              </div>
              <p className="text-sm text-muted-foreground">{modelInfo.meta_learner}</p>
            </div>
          </div>

          {modelInfo.best_params && (
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-3 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Best Parameters
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                {Object.entries(modelInfo.best_params).map(([key, value]) => (
                  <div key={key} className="flex justify-between p-2 bg-muted rounded">
                    <span className="text-muted-foreground">{key}:</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {modelInfo.metrics && typeof modelInfo.metrics === 'object' && (
        <>
          <div className="flex items-center space-x-2 mb-4">
            <BarChart3 className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Performance Metrics</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <MetricCard
              icon={Target}
              title="Accuracy"
              value={modelInfo.metrics.accuracy}
              color="text-green-500"
            />
            <MetricCard
              icon={BarChart3}
              title="F1 Score"
              value={modelInfo.metrics.f1_score}
              color="text-blue-500"
            />
            <MetricCard
              icon={TrendingUp}
              title="Precision"
              value={modelInfo.metrics.precision}
              color="text-purple-500"
            />
            <MetricCard
              icon={TrendingUp}
              title="Recall"
              value={modelInfo.metrics.recall}
              color="text-orange-500"
            />
            <MetricCard
              icon={BarChart3}
              title="Log Loss"
              value={modelInfo.metrics.log_loss}
              color="text-red-500"
            />
            <MetricCard
              icon={Target}
              title="ROC AUC"
              value={modelInfo.metrics.roc_auc}
              color="text-indigo-500"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Metrics Overview</CardTitle>
              <CardDescription>
                Visual representation of model performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(modelInfo.metrics)
                  .filter(([key]) => typeof modelInfo.metrics[key] === 'number')
                  .map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium capitalize">
                          {key.replace(/_/g, ' ')}
                        </span>
                        <span className="text-muted-foreground">
                          {value.toFixed(4)}
                        </span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-primary to-primary/50 h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${
                              key === 'log_loss'
                                ? Math.max(0, 100 - value * 50)
                                : value * 100
                            }%`
                          }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default ModelInfo;

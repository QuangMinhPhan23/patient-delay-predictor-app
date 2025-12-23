import React, { useState, useEffect } from 'react';
import { Activity, Users, Info, Cpu, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent } from './components/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/Tabs';
import SinglePrediction from './components/SinglePrediction';
import BatchPrediction from './components/BatchPrediction';
import ModelInfo from './components/ModelInfo';
import { healthCheck } from './lib/api';

function App() {
  const [apiStatus, setApiStatus] = useState(null);

  useEffect(() => {
    const checkApi = async () => {
      try {
        const response = await healthCheck();
        setApiStatus(response);
      } catch (error) {
        setApiStatus({ status: 'offline', model_loaded: false });
      }
    };
    
    checkApi();
    const interval = setInterval(checkApi, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary rounded-lg">
                <Cpu className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  ML Model Dashboard
                </h1>
                <p className="text-sm text-gray-500">
                  Stacking Classifier Prediction System
                </p>
              </div>
            </div>
            
            {/* API Status */}
            <Card className="border-none shadow-none">
              <CardContent className="p-3">
                <div className="flex items-center space-x-2">
                  {apiStatus?.status === 'healthy' ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div className="text-sm">
                        <p className="font-medium">API Online</p>
                        <p className="text-xs text-muted-foreground">
                          Model {apiStatus.model_loaded ? 'Loaded' : 'Not Loaded'}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-red-500" />
                      <div className="text-sm">
                        <p className="font-medium">API Offline</p>
                        <p className="text-xs text-muted-foreground">
                          Check connection
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="single" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
            <TabsTrigger value="single" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Single Prediction</span>
            </TabsTrigger>
            <TabsTrigger value="batch" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Batch Prediction</span>
            </TabsTrigger>
            <TabsTrigger value="info" className="flex items-center space-x-2">
              <Info className="h-4 w-4" />
              <span>Model Info</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="single">
            <SinglePrediction />
          </TabsContent>

          <TabsContent value="batch">
            <BatchPrediction />
          </TabsContent>

          <TabsContent value="info">
            <ModelInfo />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="mt-16 py-6 border-t bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground">
            ML Model Dashboard - Powered by FastAPI & React
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

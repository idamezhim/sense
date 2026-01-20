import { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { useForecasts } from './hooks/useForecasts';
import { Forecast, NewForecastData, CloseForecastData } from './types';
import { Layout } from './components/Layout';
import { Onboarding } from './pages/Onboarding';
import { ForecastLog } from './pages/ForecastLog';
import { Dashboard } from './pages/Dashboard';
import { Settings } from './pages/Settings';
import { ForecastForm } from './components/ForecastForm';
import { CloseModal } from './components/CloseModal';

function AppContent() {
  const navigate = useNavigate();
  const {
    forecasts,
    userProfile,
    weightSettings,
    createForecast,
    closeForecast,
    updateUserProfile,
    updateWeightSettings,
    clearAllData,
    importData,
    getExportData,
  } = useForecasts();

  const [showNewForecast, setShowNewForecast] = useState(false);
  const [selectedForecast, setSelectedForecast] = useState<Forecast | null>(null);

  // Show onboarding if no user profile
  if (!userProfile) {
    return (
      <Onboarding
        onComplete={(data) => {
          updateUserProfile(data);
        }}
      />
    );
  }

  const handleNewForecast = (data: NewForecastData) => {
    createForecast(data);
    setShowNewForecast(false);
  };

  const handleCloseForecast = (data: CloseForecastData) => {
    if (selectedForecast) {
      closeForecast(selectedForecast.id, data);
      setSelectedForecast(null);
    }
  };

  const handleSelectForecast = (forecast: Forecast) => {
    if (forecast.status === 'open') {
      setSelectedForecast(forecast);
    }
  };

  const handleClearAll = () => {
    clearAllData();
    navigate('/');
  };

  return (
    <Layout>
      <Routes>
        <Route
          path="/"
          element={
            showNewForecast ? (
              <ForecastForm
                weightSettings={weightSettings}
                onSubmit={handleNewForecast}
                onCancel={() => setShowNewForecast(false)}
              />
            ) : (
              <ForecastLog
                forecasts={forecasts}
                onNewForecast={() => setShowNewForecast(true)}
                onSelectForecast={handleSelectForecast}
              />
            )
          }
        />
        <Route path="/dashboard" element={<Dashboard forecasts={forecasts} />} />
        <Route
          path="/settings"
          element={
            <Settings
              userProfile={userProfile}
              weightSettings={weightSettings}
              onUpdateProfile={updateUserProfile}
              onUpdateWeights={updateWeightSettings}
              onExport={getExportData}
              onImport={importData}
              onClearAll={handleClearAll}
            />
          }
        />
      </Routes>

      {/* Close Forecast Modal */}
      {selectedForecast && (
        <CloseModal
          forecast={selectedForecast}
          onClose={handleCloseForecast}
          onCancel={() => setSelectedForecast(null)}
        />
      )}
    </Layout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;

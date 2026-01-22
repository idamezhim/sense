import { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Agentation } from 'agentation';
import { useForecasts } from './hooks/useForecasts';
import { Forecast, NewForecastData, CloseForecastData } from './types';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { HowItWorks } from './pages/HowItWorks';
import { Onboarding } from './pages/Onboarding';
import { ForecastLog } from './pages/ForecastLog';
import { Dashboard } from './pages/Dashboard';
import { Settings } from './pages/Settings';
import { ForecastForm } from './components/ForecastForm';
import { CloseModal } from './components/CloseModal';

function MainApp() {
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
    navigate('/app');
  };

  return (
    <Layout>
      <Routes>
        <Route
          path="/"
          element={
            showNewForecast ? (
              <ForecastForm
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

function AppContent() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/app/*" element={<MainApp />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter basename="/sense">
      <AppContent />
      {import.meta.env.DEV && <Agentation />}
    </BrowserRouter>
  );
}

export default App;

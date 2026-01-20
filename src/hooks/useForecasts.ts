import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorage } from './useLocalStorage';
import {
  Forecast,
  NewForecastData,
  CloseForecastData,
  WeightSettings,
  DEFAULT_WEIGHT_SETTINGS,
  UserProfile,
} from '../types';
import {
  calculateWeight,
  getConfidenceBucket,
  calculateBrierScore,
  calculateWeightedBrier,
  getOutcomeScore,
} from '../utils/scoring';

const FORECASTS_KEY = 'sense_forecasts';
const USER_PROFILE_KEY = 'sense_user_profile';
const WEIGHT_SETTINGS_KEY = 'sense_weight_settings';

export function useForecasts() {
  const [forecasts, setForecasts] = useLocalStorage<Forecast[]>(FORECASTS_KEY, []);
  const [userProfile, setUserProfile] = useLocalStorage<UserProfile | null>(
    USER_PROFILE_KEY,
    null
  );
  const [weightSettings, setWeightSettings] = useLocalStorage<WeightSettings>(
    WEIGHT_SETTINGS_KEY,
    DEFAULT_WEIGHT_SETTINGS
  );

  // Generate a sequential ID like F001, F002, etc.
  const generateForecastId = useCallback(() => {
    const maxId = forecasts.reduce((max, f) => {
      const num = parseInt(f.id.replace('F', ''), 10);
      return isNaN(num) ? max : Math.max(max, num);
    }, 0);
    return `F${String(maxId + 1).padStart(3, '0')}`;
  }, [forecasts]);

  // Create a new forecast
  const createForecast = useCallback(
    (data: NewForecastData): Forecast => {
      const weight = calculateWeight(data.betType, data.novelty, weightSettings);
      const confidenceBucket = getConfidenceBucket(data.probability);

      const newForecast: Forecast = {
        id: generateForecastId(),
        dateCreated: new Date().toISOString(),
        status: 'open',
        betType: data.betType,
        prediction: data.prediction,
        successMetric: data.successMetric,
        targetThreshold: data.targetThreshold,
        byWhen: data.byWhen,
        probability: data.probability,
        confidenceBucket,
        novelty: data.novelty,
        weight,
        // Optional supporting context
        risks: data.risks,
        evidence: data.evidence,
        imageData: data.imageData,
        imageName: data.imageName,
      };

      setForecasts((prev) => [newForecast, ...prev]);
      return newForecast;
    },
    [generateForecastId, setForecasts, weightSettings]
  );

  // Close a forecast with an outcome
  const closeForecast = useCallback(
    (forecastId: string, data: CloseForecastData): Forecast | null => {
      let closedForecast: Forecast | null = null;

      setForecasts((prev) =>
        prev.map((f) => {
          if (f.id !== forecastId) return f;

          const outcomeScore = getOutcomeScore(data.actualOutcome);
          const brierScore = calculateBrierScore(f.probability, data.actualOutcome);
          const weightedBrier = calculateWeightedBrier(brierScore, f.weight);

          closedForecast = {
            ...f,
            status: 'closed',
            actualOutcome: data.actualOutcome,
            outcomeScore,
            brierScore,
            weightedBrier,
            learningNote: data.learningNote,
            closedAt: new Date().toISOString(),
          };

          return closedForecast;
        })
      );

      return closedForecast;
    },
    [setForecasts]
  );

  // Get a single forecast by ID
  const getForecast = useCallback(
    (forecastId: string): Forecast | undefined => {
      return forecasts.find((f) => f.id === forecastId);
    },
    [forecasts]
  );

  // Delete a forecast
  const deleteForecast = useCallback(
    (forecastId: string): void => {
      setForecasts((prev) => prev.filter((f) => f.id !== forecastId));
    },
    [setForecasts]
  );

  // Update user profile
  const updateUserProfile = useCallback(
    (profile: Omit<UserProfile, 'id' | 'createdAt'>): UserProfile => {
      const newProfile: UserProfile = {
        id: userProfile?.id ?? uuidv4(),
        createdAt: userProfile?.createdAt ?? new Date().toISOString(),
        ...profile,
      };
      setUserProfile(newProfile);
      return newProfile;
    },
    [setUserProfile, userProfile]
  );

  // Update weight settings
  const updateWeightSettings = useCallback(
    (settings: WeightSettings): void => {
      setWeightSettings(settings);
    },
    [setWeightSettings]
  );

  // Clear all data
  const clearAllData = useCallback((): void => {
    setForecasts([]);
    setUserProfile(null);
    setWeightSettings(DEFAULT_WEIGHT_SETTINGS);
  }, [setForecasts, setUserProfile, setWeightSettings]);

  // Import data from JSON
  const importData = useCallback(
    (data: {
      forecasts?: Forecast[];
      userProfile?: UserProfile | null;
      weightSettings?: WeightSettings;
    }): void => {
      if (data.forecasts) setForecasts(data.forecasts);
      if (data.userProfile !== undefined) setUserProfile(data.userProfile);
      if (data.weightSettings) setWeightSettings(data.weightSettings);
    },
    [setForecasts, setUserProfile, setWeightSettings]
  );

  // Get export data
  const getExportData = useCallback(() => {
    return {
      forecasts,
      userProfile,
      weightSettings,
      exportedAt: new Date().toISOString(),
    };
  }, [forecasts, userProfile, weightSettings]);

  return {
    forecasts,
    userProfile,
    weightSettings,
    createForecast,
    closeForecast,
    getForecast,
    deleteForecast,
    updateUserProfile,
    updateWeightSettings,
    clearAllData,
    importData,
    getExportData,
  };
}

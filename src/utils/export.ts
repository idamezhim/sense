import { Forecast, UserProfile, WeightSettings } from '../types';

export interface ExportData {
  forecasts: Forecast[];
  userProfile: UserProfile | null;
  weightSettings: WeightSettings;
  exportedAt: string;
}

/**
 * Download data as a JSON file
 */
export function downloadJSON(data: ExportData, filename: string = 'sense-data.json'): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Read and parse a JSON file
 */
export function readJSONFile(file: File): Promise<ExportData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const result = event.target?.result;
        if (typeof result !== 'string') {
          reject(new Error('Failed to read file'));
          return;
        }

        const data = JSON.parse(result) as ExportData;

        // Basic validation
        if (!data.forecasts || !Array.isArray(data.forecasts)) {
          reject(new Error('Invalid data format: missing forecasts array'));
          return;
        }

        resolve(data);
      } catch (error) {
        reject(new Error('Failed to parse JSON file'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
}

/**
 * Validate imported data structure
 */
export function validateImportData(data: unknown): data is ExportData {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  const d = data as Record<string, unknown>;

  // Must have forecasts array
  if (!Array.isArray(d.forecasts)) {
    return false;
  }

  // Validate each forecast has required fields
  for (const forecast of d.forecasts) {
    if (typeof forecast !== 'object' || forecast === null) {
      return false;
    }
    const f = forecast as Record<string, unknown>;
    if (
      typeof f.id !== 'string' ||
      typeof f.prediction !== 'string' ||
      typeof f.probability !== 'number'
    ) {
      return false;
    }

    // Validate optional fields have correct types if present
    if (f.risks !== undefined && typeof f.risks !== 'string') {
      return false;
    }
    if (f.evidence !== undefined && typeof f.evidence !== 'string') {
      return false;
    }
    if (f.imageData !== undefined && typeof f.imageData !== 'string') {
      return false;
    }
    if (f.imageName !== undefined && typeof f.imageName !== 'string') {
      return false;
    }
  }

  return true;
}

/**
 * Estimate the size of export data in bytes
 */
export function estimateExportSize(data: ExportData): number {
  const json = JSON.stringify(data);
  return json.length;
}

/**
 * Format bytes to a human-readable string
 */
export function formatExportSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Generate export filename with timestamp
 */
export function generateExportFilename(): string {
  const date = new Date();
  const timestamp = date.toISOString().slice(0, 10);
  return `sense-export-${timestamp}.json`;
}

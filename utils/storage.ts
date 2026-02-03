
import { EvaluationData } from '../types';

const STORAGE_KEY = 'mudas_evaluations';

// Gets all evaluations from localStorage
export const getAllEvaluations = (): EvaluationData[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Falha ao ler avaliações. Tentando recuperar.", error);
    // Tenta mover os dados corrompidos para um backup para não perder tudo
    const corruptedData = localStorage.getItem(STORAGE_KEY);
    if (corruptedData) {
      localStorage.setItem(`${STORAGE_KEY}_corrompido_${Date.now()}`, corruptedData);
      localStorage.removeItem(STORAGE_KEY);
    }
    return [];
  }
};

// Saves the entire list of evaluations back to localStorage
const saveAllEvaluations = (evaluations: EvaluationData[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(evaluations));
  } catch (error) {
    console.error("Failed to save evaluations to localStorage", error);
  }
};

const getMonthKeyFromDateString = (dateStr: string): string => {
  // dateStr is in 'dd/mm/yyyy' format
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const year = parts[2];
    const month = parts[1]; // month is 'mm'
    return `${year}-${month}`;
  }
  // Fallback for any unexpected format
  console.warn(`Invalid date format for grouping: ${dateStr}`);
  return 'Data Inválida';
};


// Public function to save a single new evaluation
export const saveEvaluation = (evaluationData: EvaluationData): EvaluationData => {
  const evaluations = getAllEvaluations();
  const newEvaluation: EvaluationData = {
    ...evaluationData,
    id: `eval_${Date.now()}`,
    savedAt: Date.now(),
  };
  evaluations.unshift(newEvaluation); // Add to the beginning
  saveAllEvaluations(evaluations);
  return newEvaluation;
};

// Public function to delete an evaluation
export const deleteEvaluation = (id: string) => {
  const evaluations = getAllEvaluations();
  const updatedEvaluations = evaluations.filter(e => e.id !== id);
  saveAllEvaluations(updatedEvaluations);
};

// Public function to get saved evaluations grouped by month
export const getSavedEvaluations = (): Record<string, EvaluationData[]> => {
  const evaluations = getAllEvaluations();

  // Sort evaluations by the actual evaluation date (descending),
  // using the save timestamp as a tie-breaker.
  evaluations.sort((a, b) => {
    const partsA = a.date.split('/');
    // new Date(year, monthIndex, day)
    const dateA = new Date(Number(partsA[2]), Number(partsA[1]) - 1, Number(partsA[0]));
    
    const partsB = b.date.split('/');
    const dateB = new Date(Number(partsB[2]), Number(partsB[1]) - 1, Number(partsB[0]));

    // Compare dates
    const dateDiff = dateB.getTime() - dateA.getTime();
    if (dateDiff !== 0) {
      return dateDiff;
    }
    
    // If dates are the same, sort by save time (newest first)
    return (b.savedAt || 0) - (a.savedAt || 0);
  });

  // Group the sorted evaluations by month based on the evaluation date
  const grouped: Record<string, EvaluationData[]> = {};
  for (const evaluation of evaluations) {
    const monthKey = getMonthKeyFromDateString(evaluation.date);
    if (!grouped[monthKey]) {
      grouped[monthKey] = [];
    }
    grouped[monthKey].push(evaluation);
  }
  
  return grouped;
};

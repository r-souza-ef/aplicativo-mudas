import React, { useState, useCallback, useEffect } from 'react';
import { Screen, EvaluationData, SeedlingStatus, HoleStatus, DistanceStatus } from './types';
import { TOTAL_SEEDLINGS, TOTAL_HOLES, TOTAL_DISTANCE_HOLES } from './constants';
import SetupScreen from './components/SetupScreen';
import EvaluationScreen from './components/EvaluationScreen';
import ResultsScreen from './components/ResultsScreen';
import HistoryScreen from './components/HistoryScreen';
import DistanceEvaluationScreen from './components/DistanceEvaluationScreen';

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>(Screen.Setup);
  const [evaluationData, setEvaluationData] = useState<EvaluationData | null>(null);
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);

    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  const handleStartEvaluation = useCallback((areaCode: string, date: string, type: string) => {
    let totalSamples = TOTAL_SEEDLINGS;
    let initialStatus = SeedlingStatus.NotEvaluated as string;
    let measurements;

    if (type === 'Avaliação de qualidade de covas') {
      totalSamples = TOTAL_HOLES;
      initialStatus = HoleStatus.NotEvaluated;
    } else if (type === 'Avaliação de Distância de Covas') {
      totalSamples = TOTAL_DISTANCE_HOLES;
      initialStatus = DistanceStatus.NotEvaluated;
      measurements = Array(totalSamples).fill({});
    }

    setEvaluationData({
      areaCode,
      date,
      type,
      totalSamples,
      samples: Array(totalSamples).fill(initialStatus),
      measurements,
    });
    setScreen(Screen.Evaluation);
  }, []);

  const handleFinishEvaluation = useCallback((samples: string[], measurements?: { street?: number; line?: number }[]) => {
    if (evaluationData) {
      const finalEvaluationData: EvaluationData = { ...evaluationData, samples };
      if (measurements) {
        finalEvaluationData.measurements = measurements;
      }
      setEvaluationData(finalEvaluationData);
      setScreen(Screen.Results);
    }
  }, [evaluationData]);

  const handleLeaveResults = useCallback(() => {
    if (evaluationData?.savedAt) {
      setScreen(Screen.History);
    } else {
      setScreen(Screen.Setup);
    }
    setEvaluationData(null);
  }, [evaluationData]);

  const handleShowHistory = useCallback(() => {
    setEvaluationData(null);
    setScreen(Screen.History);
  }, []);

  const handleBackToSetup = useCallback(() => {
    setEvaluationData(null);
    setScreen(Screen.Setup);
  }, []);

  const handleViewEvaluation = useCallback((data: EvaluationData) => {
    setEvaluationData(data);
    setScreen(Screen.Results);
  }, []);

  const renderScreen = () => {
    switch (screen) {
      case Screen.Setup:
        return <SetupScreen onStart={handleStartEvaluation} onShowHistory={handleShowHistory} />;
      case Screen.Evaluation:
        if (evaluationData) {
          if (evaluationData.type === 'Avaliação de Distância de Covas') {
            return <DistanceEvaluationScreen evaluationData={evaluationData} onFinish={handleFinishEvaluation} />;
          }
          return <EvaluationScreen evaluationData={evaluationData} onFinish={(s) => handleFinishEvaluation(s)} />;
        }
        return null;
      case Screen.Results:
        if (evaluationData) {
          return <ResultsScreen evaluationData={evaluationData} onBack={handleLeaveResults} />;
        }
        return null;
      case Screen.History:
        return <HistoryScreen onViewEvaluation={handleViewEvaluation} onBack={handleBackToSetup} />;
      default:
        return <SetupScreen onStart={handleStartEvaluation} onShowHistory={handleShowHistory} />;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 flex flex-col items-center">
      {!online && (
        <div className="w-full bg-amber-500 text-white text-center py-1 text-xs font-bold animate-pulse sticky top-0 z-[100] shadow-md">
          MODO OFFLINE ATIVO - Dados salvos localmente
        </div>
      )}
      <div className="w-full max-w-md mx-auto p-4">
        {renderScreen()}
      </div>
    </div>
  );
};

export default App;
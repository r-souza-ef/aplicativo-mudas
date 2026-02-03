
import React, { useMemo, useState } from 'react';
import { EvaluationData, SeedlingStatus, HoleStatus, DistanceStatus, EvaluationResults } from '../types';
import { STATUS_DETAILS, HOLE_STATUS_DETAILS, DISTANCE_STATUS_DETAILS } from '../constants';
import StatCard from './StatCard';
import ProgressBar from './ProgressBar';
import { saveEvaluation, deleteEvaluation } from '../utils/storage';

interface ResultsScreenProps {
  evaluationData: EvaluationData;
  onBack: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ evaluationData, onBack }) => {
  const [currentEvaluation, setCurrentEvaluation] = useState(evaluationData);
  const isViewingHistory = !!currentEvaluation.savedAt;
  const [isSaved, setIsSaved] = useState(isViewingHistory);

  const handleSave = () => {
    const savedData = saveEvaluation(currentEvaluation);
    setCurrentEvaluation(savedData);
    setIsSaved(true);
  };

  const handleDeleteFromResults = () => {
    if (currentEvaluation.id && window.confirm('Tem certeza que deseja apagar esta avaliação do histórico?')) {
      deleteEvaluation(currentEvaluation.id);
      onBack();
    }
  };

  const results: EvaluationResults = useMemo(() => {
    const isHoleQualityEval = currentEvaluation.type === 'Avaliação de qualidade de covas';
    const isDistanceEval = currentEvaluation.type === 'Avaliação de Distância de Covas';
    const TOTAL_SAMPLES = currentEvaluation.totalSamples;

    let StatusEnum: typeof SeedlingStatus | typeof HoleStatus | typeof DistanceStatus = SeedlingStatus;

    if (isHoleQualityEval) {
        StatusEnum = HoleStatus;
    } else if (isDistanceEval) {
        StatusEnum = DistanceStatus;
    }

    const okCount = currentEvaluation.samples.filter(s => s === StatusEnum.Ok).length;
    const problemCount = TOTAL_SAMPLES - okCount;
    const qualityRate = TOTAL_SAMPLES > 0 ? (okCount / TOTAL_SAMPLES) * 100 : 0;
    const problemRate = TOTAL_SAMPLES > 0 ? (problemCount / TOTAL_SAMPLES) * 100 : 0;
    const problemDetails: { [key: string]: { count: number; percentage: number } } = {};

    if (isDistanceEval) {
        const streetProblemCount = currentEvaluation.samples.filter(s => s === DistanceStatus.StreetProblem || s === DistanceStatus.BothProblem).length;
        const lineProblemCount = currentEvaluation.samples.filter(s => s === DistanceStatus.LineProblem || s === DistanceStatus.BothProblem).length;

        if (streetProblemCount > 0) {
            problemDetails[DistanceStatus.StreetProblem] = {
                count: streetProblemCount,
                percentage: (streetProblemCount / TOTAL_SAMPLES) * 100,
            };
        }
        if (lineProblemCount > 0) {
            problemDetails[DistanceStatus.LineProblem] = {
                count: lineProblemCount,
                percentage: (lineProblemCount / TOTAL_SAMPLES) * 100,
            };
        }
    } else {
        Object.values(StatusEnum).forEach(status => {
          if (status !== StatusEnum.Ok && status !== StatusEnum.NotEvaluated) {
            const count = currentEvaluation.samples.filter(s => s === status).length;
            if (count > 0) {
              problemDetails[status] = {
                count,
                percentage: TOTAL_SAMPLES > 0 ? (count / TOTAL_SAMPLES) * 100 : 0,
              };
            }
          }
        });
    }

    return { okCount, problemCount, qualityRate, problemRate, problemDetails };
  }, [currentEvaluation]);

  const getQualityStatus = () => {
    if (results.qualityRate >= 95) return { text: 'Excelente', color: 'bg-green-500' };
    return { text: 'Ruim', color: 'bg-red-500' };
  };
  
  // Added const to properly declare qualityStatus variable
  const qualityStatus = getQualityStatus();

  const isHoleQualityEval = currentEvaluation.type === 'Avaliação de qualidade de covas';
  const isDistanceEval = currentEvaluation.type === 'Avaliação de Distância de Covas';
  
  let CURRENT_STATUS_DETAILS: Record<string, any> = STATUS_DETAILS;
  if(isHoleQualityEval) CURRENT_STATUS_DETAILS = HOLE_STATUS_DETAILS;
  if(isDistanceEval) CURRENT_STATUS_DETAILS = DISTANCE_STATUS_DETAILS;
  
  const sampleTerm = isHoleQualityEval || isDistanceEval ? 'Amostras' : 'Mudas';

  return (
    <div className="w-full max-w-md mx-auto space-y-6 pb-6">
      <div className="text-center py-6">
        <div className="mx-auto bg-amber-500 p-4 rounded-xl inline-block mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        </div>
        <h1 className="text-3xl font-bold">Avaliação Concluída</h1>
        <div className="text-slate-500 mt-4 space-y-1">
            <p className="flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>Área {currentEvaluation.areaCode}</p>
            <p className="flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>{currentEvaluation.date}</p>
            <p className="flex items-center justify-center text-sm"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>{currentEvaluation.type}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg space-y-4">
        <div className="flex items-center">
          <div className="bg-green-100 p-2 rounded-full mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-12v4m-2-2h4m5 6v4m-2-2h4M4 11a1 1 0 011-1h14a1 1 0 110 2H5a1 1 0 01-1-1z" /></svg>
          </div>
          <div className="flex-grow">
            <div className="flex justify-between items-baseline">
                <span className="text-slate-500">Taxa de Qualidade</span>
                <span className={`px-3 py-1 text-xs font-semibold text-white rounded-full ${qualityStatus.color}`}>{qualityStatus.text}</span>
            </div>
            <p className="text-3xl font-bold text-green-700">{results.qualityRate.toFixed(1)}%</p>
          </div>
        </div>
        <ProgressBar percentage={results.qualityRate} color="bg-amber-500" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatCard label={`${sampleTerm} Avaliadas`} value={currentEvaluation.totalSamples.toString()} />
        <StatCard label={`${sampleTerm} Conformes`} value={results.okCount.toString()} color="text-green-600" />
        <StatCard label={`${sampleTerm} c/ Problemas`} value={results.problemCount.toString()} color="text-red-600" />
        <StatCard label="Taxa de Problemas" value={`${results.problemRate.toFixed(1)}%`} color="text-amber-600" />
      </div>
      
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            Detalhamento de Problemas
        </h2>
        <div className="space-y-4">
          {Object.entries(results.problemDetails).map(([status, data]) => (
            <div key={status}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600">{CURRENT_STATUS_DETAILS[status]?.label}</span>
                <span className="font-semibold">{data.count} ({data.percentage.toFixed(1)}%)</span>
              </div>
              <ProgressBar percentage={data.percentage} color={CURRENT_STATUS_DETAILS[status]?.color.split(' ')[0] ?? 'bg-red-500'} thin />
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-3">
        {isViewingHistory ? (
            <div className="grid grid-cols-1 gap-3">
              <button onClick={onBack} className="w-full bg-green-700 text-white font-bold p-4 rounded-lg hover:bg-green-800 transition-colors duration-300 flex items-center justify-center shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 15l-3-3m0 0l3-3m-3 3h8a5 5 0 000-10H6" /></svg>
                  Voltar ao Histórico
              </button>
              <button onClick={handleDeleteFromResults} className="w-full bg-red-50 text-red-600 border border-red-200 font-bold p-4 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-300 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  Apagar do Histórico
              </button>
            </div>
        ) : (
            <>
                <button 
                    onClick={handleSave}
                    disabled={isSaved}
                    className="w-full bg-green-700 text-white font-bold p-4 rounded-lg hover:bg-green-800 transition-colors duration-300 flex items-center justify-center shadow-md disabled:bg-green-400 disabled:cursor-not-allowed"
                >
                    {isSaved ? (
                        <><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Salvo!</>
                    ) : (
                        <><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg> Salvar Avaliação</>
                    )}
                </button>
                <button onClick={onBack} className="w-full bg-white text-green-700 border border-green-700 font-bold p-4 rounded-lg hover:bg-green-50 transition-colors duration-300 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 20h5v-5M20 4h-5v5" /></svg>
                    Nova Avaliação
                </button>
            </>
        )}
      </div>

    </div>
  );
};

export default ResultsScreen;

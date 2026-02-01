
import React, { useState, useEffect, useMemo } from 'react';
import { EvaluationData, SeedlingStatus, HoleStatus, DistanceStatus } from '../types';
import { getSavedEvaluations, getAllEvaluations } from '../utils/storage';
import { exportToExcel } from '../utils/export';

interface HistoryScreenProps {
  onBack: () => void;
  onViewEvaluation: (evaluation: EvaluationData) => void;
}

const HistoryScreen: React.FC<HistoryScreenProps> = ({ onBack, onViewEvaluation }) => {
  const [evaluations, setEvaluations] = useState<Record<string, EvaluationData[]>>({});
  const [activeTab, setActiveTab] = useState<'mudas' | 'covas'>('mudas');
  const allEvaluations = useMemo(() => getAllEvaluations(), []);

  useEffect(() => {
    setEvaluations(getSavedEvaluations());
  }, []);
  
  const filteredEvaluations = useMemo(() => {
      const result: Record<string, EvaluationData[]> = {};
      for (const monthKey in evaluations) {
          const monthEvals = evaluations[monthKey].filter(ev => {
              const isHoleEval = ev.type === 'Avaliação de qualidade de covas' || ev.type === 'Avaliação de Distância de Covas';
              if (activeTab === 'covas') {
                  return isHoleEval;
              } else { // activeTab === 'mudas'
                  return !isHoleEval;
              }
          });
          if (monthEvals.length > 0) {
              result[monthKey] = monthEvals;
          }
      }
      return result;
  }, [evaluations, activeTab]);

  const handleExportAll = () => {
    if (allEvaluations.length > 0) {
      exportToExcel(allEvaluations, `Relatorio_Completo_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}`);
    }
  };

  const handleExportMonth = (monthKey: string) => {
    const monthEvaluations = filteredEvaluations[monthKey];
    if (monthEvaluations && monthEvaluations.length > 0) {
      const typeName = activeTab === 'mudas' ? 'Mudas' : 'Covas';
      exportToExcel(monthEvaluations, `Relatorio_${typeName}_${monthKey.replace('-', '_')}`);
    }
  };
  
  const getQualityRate = (evaluation: EvaluationData): number => {
    const isHoleQualityEval = evaluation.type === 'Avaliação de qualidade de covas';
    const isDistanceEval = evaluation.type === 'Avaliação de Distância de Covas';
    
    let okStatus: string = SeedlingStatus.Ok;
    if (isHoleQualityEval) okStatus = HoleStatus.Ok;
    else if (isDistanceEval) okStatus = DistanceStatus.Ok;

    const total = evaluation.totalSamples;
    if (total <= 0) return 0;

    const okCount = evaluation.samples.filter(s => s === okStatus).length;
    return (okCount / total) * 100;
  };
  
  const monthNames: { [key: string]: string } = {
    '01': 'Janeiro', '02': 'Fevereiro', '03': 'Março', '04': 'Abril',
    '05': 'Maio', '06': 'Junho', '07': 'Julho', '08': 'Agosto',
    '09': 'Setembro', '10': 'Outubro', '11': 'Novembro', '12': 'Dezembro'
  };

  const formatMonthDisplay = (monthKey: string) => {
    const [year, month] = monthKey.split('-');
    return `${monthNames[month]} de ${year}`;
  };

  const sortedMonths = useMemo(() => {
    return Object.keys(filteredEvaluations).sort((a, b) => b.localeCompare(a));
  }, [filteredEvaluations]);

  const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );
  
  const TabButton: React.FC<{tabName: 'mudas' | 'covas'; label: string;}> = ({ tabName, label }) => (
      <button 
        onClick={() => setActiveTab(tabName)} 
        className={`w-full p-3 font-semibold text-center transition-colors duration-300 ${activeTab === tabName ? 'border-b-2 border-green-700 text-green-700' : 'text-slate-500 hover:bg-slate-100'}`}
       >
        {label}
      </button>
  );

  return (
    <div className="w-full max-w-md mx-auto space-y-6 pb-6">
      <div className="flex items-center justify-between sticky top-0 bg-slate-50 py-4 z-10">
         <h1 className="text-3xl font-bold">Histórico</h1>
         <button onClick={onBack} className="text-green-700 font-semibold p-2 rounded-lg hover:bg-green-100 transition-colors">Voltar</button>
      </div>
      
       <div className="bg-white rounded-lg shadow-md">
        <div className="flex border-b border-slate-200">
           <TabButton tabName="mudas" label="Mudas" />
           <TabButton tabName="covas" label="Covas" />
        </div>
      </div>
      
      <button 
        onClick={handleExportAll} 
        disabled={allEvaluations.length === 0}
        className="w-full bg-green-700 text-white font-bold p-3 rounded-lg hover:bg-green-800 transition-colors duration-300 flex items-center justify-center shadow-md disabled:bg-green-400 disabled:cursor-not-allowed"
      >
        <DownloadIcon />
        <span className="ml-2">Exportar Relatório Completo</span>
      </button>

      {sortedMonths.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-2xl shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          <p className="mt-4 text-slate-500">Nenhuma avaliação salva para este tipo.</p>
        </div>
      ) : (
        <div className="space-y-6">
            {sortedMonths.map(monthKey => (
            <div key={monthKey}>
                <div className="flex justify-between items-center mb-3 px-2">
                    <h2 className="text-xl font-semibold text-slate-600">{formatMonthDisplay(monthKey)}</h2>
                    <button onClick={() => handleExportMonth(monthKey)} className="p-2 text-slate-500 hover:bg-slate-200 hover:text-green-700 rounded-full transition-colors">
                        <DownloadIcon />
                    </button>
                </div>
                <div className="space-y-3">
                {filteredEvaluations[monthKey].map(evaluation => (
                    <button 
                    key={evaluation.id} 
                    onClick={() => onViewEvaluation(evaluation)} 
                    className="w-full bg-white p-4 rounded-2xl shadow-lg text-left flex items-center justify-between hover:ring-2 hover:ring-green-500 transition-all duration-200"
                    >
                    <div>
                        <p className="font-bold text-lg">Área {evaluation.areaCode}</p>
                        <p className="text-sm text-slate-500">{evaluation.type}</p>
                        <p className="text-xs text-slate-400 mt-1">{evaluation.date}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">{getQualityRate(evaluation).toFixed(1)}%</p>
                        <p className="text-xs text-slate-500">Qualidade</p>
                    </div>
                    </button>
                ))}
                </div>
            </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default HistoryScreen;
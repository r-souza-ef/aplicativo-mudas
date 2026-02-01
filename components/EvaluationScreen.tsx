
import React, { useState, useEffect, useRef } from 'react';
import { EvaluationData, SeedlingStatus, HoleStatus } from '../types';
import { TOTAL_SEEDLINGS, TOTAL_HOLES, STATUS_DETAILS, HOLE_STATUS_DETAILS } from '../constants';

interface EvaluationScreenProps {
  evaluationData: EvaluationData;
  onFinish: (samples: string[]) => void;
}

const EvaluationScreen: React.FC<EvaluationScreenProps> = ({ evaluationData, onFinish }) => {
  const [samples, setSamples] = useState<string[]>(evaluationData.samples);
  const [selectedSample, setSelectedSample] = useState<number | null>(0);
  const [showLegend, setShowLegend] = useState(false);

  const isHoleQualityEvaluation = evaluationData.type === 'Avaliação de qualidade de covas';
  const TOTAL_SAMPLES = isHoleQualityEvaluation ? TOTAL_HOLES : TOTAL_SEEDLINGS;
  const CURRENT_STATUS_DETAILS: Record<string, { label: string; shortLabel: string; color: string; icon: React.ReactElement }> = isHoleQualityEvaluation ? HOLE_STATUS_DETAILS : STATUS_DETAILS;
  const StatusEnum = isHoleQualityEvaluation ? HoleStatus : SeedlingStatus;

  const evaluatedCount = samples.filter(s => s !== StatusEnum.NotEvaluated).length;
  const progress = (evaluatedCount / TOTAL_SAMPLES) * 100;
  const sampleTerm = isHoleQualityEvaluation ? 'Cova' : 'Muda';
  const sampleTermPlural = isHoleQualityEvaluation ? 'covas' : 'mudas';

  const gridRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (selectedSample !== null) {
      const element = document.getElementById(`sample-${selectedSample}`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [selectedSample]);

  useEffect(() => {
    if (evaluatedCount === TOTAL_SAMPLES) {
      onFinish(samples);
    }
  }, [evaluatedCount, samples, onFinish, TOTAL_SAMPLES]);

  const handleStatusSelect = (status: string) => {
    if (selectedSample === null) return;

    const newSamples = [...samples];
    newSamples[selectedSample] = status;
    setSamples(newSamples);
    
    const nextNotEvaluated = newSamples.findIndex((s, i) => i > selectedSample && s === StatusEnum.NotEvaluated);
    if (nextNotEvaluated !== -1) {
      setSelectedSample(nextNotEvaluated);
    } else {
      const firstNotEvaluated = newSamples.findIndex(s => s === StatusEnum.NotEvaluated);
      setSelectedSample(firstNotEvaluated !== -1 ? firstNotEvaluated : null);
    }
  };

  const getSampleButtonClass = (status: string, index: number) => {
    const baseClass = 'w-12 h-12 flex items-center justify-center rounded-lg font-bold text-sm transition-all duration-200';
    const statusColor = status === StatusEnum.NotEvaluated ? 'bg-slate-200 text-slate-600' : CURRENT_STATUS_DETAILS[status].color;
    const selectedClass = index === selectedSample ? 'ring-4 ring-offset-2 ring-blue-500' : 'shadow-sm';
    return `${baseClass} ${statusColor} ${selectedClass}`;
  };

  const problemStatuses = Object.values(StatusEnum).filter(s => s !== StatusEnum.NotEvaluated && s !== StatusEnum.Ok);

  return (
    <div className="pb-40"> {/* Padding bottom to make space for fixed footer */}
      <div className="bg-white p-4 rounded-b-2xl shadow-md sticky top-0 z-10">
        <h1 className="text-xl font-bold text-center">Área {evaluationData.areaCode}</h1>
        <p className="text-center text-slate-500 text-sm">{evaluatedCount} de {TOTAL_SAMPLES} {sampleTermPlural} avaliadas</p>
        <div className="w-full bg-slate-200 rounded-full h-2.5 mt-2">
          <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-4">
          <button onClick={() => setShowLegend(!showLegend)} className="flex items-center justify-between w-full p-2 bg-slate-100 rounded-lg">
            <span className="font-semibold">Legenda</span>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${showLegend ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>
          {showLegend && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 p-4 bg-white rounded-b-lg border border-t-0 border-slate-200">
              {[StatusEnum.Ok, ...problemStatuses].map(status => (
                <div key={status} className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-md flex items-center justify-center ${CURRENT_STATUS_DETAILS[status].color}`}>
                     {React.cloneElement(CURRENT_STATUS_DETAILS[status].icon, { className: 'h-5 w-5' })}
                  </div>
                  <span className="text-sm">{CURRENT_STATUS_DETAILS[status].label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div ref={gridRef} className="grid grid-cols-5 gap-2">
          {samples.map((status, index) => (
            <button key={index} id={`sample-${index}`} onClick={() => setSelectedSample(index)} className={getSampleButtonClass(status, index)}>
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-20 max-w-md mx-auto rounded-t-2xl shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)]">
        <p className="text-center font-semibold mb-3">{sampleTerm} #{selectedSample !== null ? selectedSample + 1 : '-'} - Selecione o estado:</p>
        <div className={`grid gap-2 ${isHoleQualityEvaluation ? 'grid-cols-4' : 'grid-cols-5'}`}>
          {[StatusEnum.Ok, ...problemStatuses].map(status => (
            <button key={status} onClick={() => handleStatusSelect(status)} className={`flex flex-col items-center justify-center p-2 rounded-lg text-white font-bold h-16 transition-transform hover:scale-105 ${CURRENT_STATUS_DETAILS[status].color}`}>
              {React.cloneElement(CURRENT_STATUS_DETAILS[status].icon, { className: 'h-6 w-6' })}
              <span className="text-xs mt-1">{CURRENT_STATUS_DETAILS[status].shortLabel}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EvaluationScreen;

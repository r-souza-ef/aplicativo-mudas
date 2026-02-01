
import React, { useState } from 'react';
import { EvaluationData, DistanceStatus } from '../types';
import { TOTAL_DISTANCE_HOLES, MIN_STREET_DISTANCE, MAX_STREET_DISTANCE, MIN_LINE_DISTANCE, MAX_LINE_DISTANCE } from '../constants';

interface DistanceEvaluationScreenProps {
  evaluationData: EvaluationData;
  onFinish: (samples: string[], measurements: { street?: number; line?: number }[]) => void;
}

const DistanceEvaluationScreen: React.FC<DistanceEvaluationScreenProps> = ({ evaluationData, onFinish }) => {
  const [measurements, setMeasurements] = useState<{ street?: number; line?: number }[]>(
    evaluationData.measurements || Array(TOTAL_DISTANCE_HOLES).fill({})
  );

  const handleMeasurementChange = (index: number, type: 'street' | 'line', value: string) => {
    const newMeasurements = [...measurements];
    
    // Se o valor for vazio, resetamos para undefined
    if (value === '') {
      newMeasurements[index] = { ...newMeasurements[index], [type]: undefined };
      setMeasurements(newMeasurements);
      return;
    }

    const numericValue = parseFloat(value);
    
    // Se não for um número válido, não atualizamos o estado
    if (isNaN(numericValue)) {
        return; 
    }

    newMeasurements[index] = {
      ...newMeasurements[index],
      [type]: numericValue,
    };
    setMeasurements(newMeasurements);
  };
  
  const isComplete = measurements.every(m => m.street !== undefined && m.line !== undefined);

  const handleFinish = () => {
    if (!isComplete) {
      alert('Por favor, preencha todas as medições antes de finalizar.');
      return;
    }
    
    const finalSamples = measurements.map(m => {
      const streetVal = m.street;
      const lineVal = m.line;

      if (streetVal === undefined || lineVal === undefined) {
        return DistanceStatus.NotEvaluated;
      }

      const isStreetOk = streetVal >= MIN_STREET_DISTANCE && streetVal <= MAX_STREET_DISTANCE;
      const isLineOk = lineVal >= MIN_LINE_DISTANCE && lineVal <= MAX_LINE_DISTANCE;

      if (isStreetOk && isLineOk) return DistanceStatus.Ok;
      if (!isStreetOk && !isLineOk) return DistanceStatus.BothProblem;
      if (!isStreetOk) return DistanceStatus.StreetProblem;
      return DistanceStatus.LineProblem;
    });

    onFinish(finalSamples, measurements);
  };
  
  const getInputClass = (type: 'street' | 'line', value?: number) => {
    let baseClass = 'w-full p-2 border rounded-md text-center bg-white';
    if (value === undefined) {
      return `${baseClass} border-slate-300`;
    }
    const min = type === 'street' ? MIN_STREET_DISTANCE : MIN_LINE_DISTANCE;
    const max = type === 'street' ? MAX_STREET_DISTANCE : MAX_LINE_DISTANCE;
    
    if (value >= min && value <= max) {
      return `${baseClass} border-green-500 bg-green-50 ring-1 ring-green-500`;
    } else {
      return `${baseClass} border-red-500 bg-red-50 ring-1 ring-red-500`;
    }
  };
  
  const evaluatedCount = measurements.filter(m => m.street !== undefined && m.line !== undefined).length;
  const progress = (evaluatedCount / TOTAL_DISTANCE_HOLES) * 100;

  return (
    <div className="pb-24">
       <div className="bg-white p-4 rounded-b-2xl shadow-md sticky top-0 z-10">
        <h1 className="text-xl font-bold text-center">Área {evaluationData.areaCode}</h1>
        <p className="text-center text-slate-500 text-sm">{evaluationData.type}</p>
        <p className="text-center text-slate-500 text-sm mt-2">{evaluatedCount} de {TOTAL_DISTANCE_HOLES} covas medidas</p>
        <div className="w-full bg-slate-200 rounded-full h-2.5 mt-2">
          <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="grid grid-cols-3 gap-x-2 text-center font-semibold sticky top-[115px] bg-slate-50 py-2 z-[9]">
            <div className="text-slate-600">Cova #</div>
            <div className="text-slate-600">Rua (m)</div>
            <div className="text-slate-600">Linha (m)</div>
        </div>
        {measurements.map((m, index) => (
          <div key={index} className="grid grid-cols-3 gap-x-2 items-center bg-white p-2 rounded-lg shadow-sm">
            <div className="font-bold text-slate-700 text-center">
              {index + 1}
            </div>
            <div>
              <input
                type="number"
                step="0.01"
                placeholder="2.7-3.3"
                value={m.street ?? ''}
                onChange={(e) => handleMeasurementChange(index, 'street', e.target.value)}
                className={getInputClass('street', m.street)}
              />
            </div>
            <div>
              <input
                type="number"
                step="0.01"
                placeholder="1.7-2.3"
                value={m.line ?? ''}
                onChange={(e) => handleMeasurementChange(index, 'line', e.target.value)}
                className={getInputClass('line', m.line)}
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-20 max-w-md mx-auto rounded-t-2xl shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)]">
        <button
          onClick={handleFinish}
          disabled={!isComplete}
          className="w-full bg-green-700 text-white font-bold p-4 rounded-lg hover:bg-green-800 transition-colors duration-300 shadow-md disabled:bg-green-400 disabled:cursor-not-allowed"
        >
          {isComplete ? 'Finalizar Avaliação' : `Preencha as ${TOTAL_DISTANCE_HOLES - evaluatedCount} restantes`}
        </button>
      </div>

    </div>
  );
};

export default DistanceEvaluationScreen;
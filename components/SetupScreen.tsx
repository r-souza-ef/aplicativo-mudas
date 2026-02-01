
import React, { useState } from 'react';
import { EVALUATION_TYPES } from '../constants';

interface SetupScreenProps {
  onStart: (areaCode: string, date: string, type: string) => void;
  onShowHistory: () => void;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ onStart, onShowHistory }) => {
  const [areaCode, setAreaCode] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState(EVALUATION_TYPES[0]);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d+-[A-Za-z]$/.test(areaCode)) {
      setError('Formato inválido. Use número-letra (ex: 592-B).');
      return;
    }
    setError('');
    onStart(areaCode.toUpperCase(), new Date(date).toLocaleDateString('pt-BR'), type);
  };
  
  const formattedDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto bg-green-700 p-4 rounded-xl inline-block mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-slate-800">Avaliação de Mudas</h1>
        <p className="text-slate-500 mt-2 mb-8">Preencha os dados da área para iniciar</p>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-lg text-left space-y-6">
          <div>
            <label htmlFor="area-code" className="flex items-center text-sm font-medium text-slate-600 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Código da Área
            </label>
            <input
              type="text"
              id="area-code"
              value={areaCode}
              onChange={(e) => setAreaCode(e.target.value)}
              placeholder="Ex: 592-B"
              className="w-full p-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              required
            />
            <p className="text-xs text-slate-400 mt-1">Formato: número-letra (ex: 592-B)</p>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>

          <div>
            <label htmlFor="eval-date" className="flex items-center text-sm font-medium text-slate-600 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              Data da Avaliação
            </label>
            <div className="relative">
              <input
                type="date"
                id="eval-date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition appearance-none"
                required
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">{formattedDate(date)}</span>
            </div>
          </div>
          
          <div>
            <label htmlFor="eval-type" className="flex items-center text-sm font-medium text-slate-600 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Tipo de Avaliação
            </label>
            <div className="relative">
                <select
                  id="eval-type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full p-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition appearance-none"
                  required
                >
                  {EVALUATION_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
          
          <button type="submit" className="w-full bg-green-700 text-white font-bold p-4 rounded-lg hover:bg-green-800 transition-colors duration-300 shadow-md">
            Iniciar Avaliação
          </button>
        </form>
        <button 
          onClick={onShowHistory} 
          className="w-full mt-4 bg-white text-green-700 border border-green-700 font-bold p-4 rounded-lg hover:bg-green-50 transition-colors duration-300 flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          Ver Histórico
        </button>
      </div>
    </div>
  );
};

export default SetupScreen;

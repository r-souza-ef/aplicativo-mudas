
import React from 'react';
import { SeedlingStatus, HoleStatus, DistanceStatus } from './types';

export const TOTAL_SEEDLINGS = 200;
export const TOTAL_HOLES = 100;
export const TOTAL_DISTANCE_HOLES = 50;
export const SEEDLINGS_PER_HECTARE = 1667;

export const EVALUATION_TYPES = [
  'Avaliação de Plantio',
  'Avaliação de Sobrevivência de 15 dias',
  'Avaliação de Sobrevivência de 30 dias',
  'Avaliação de Sobrevivência de 60 dias',
  'Avaliação de Sobrevivência de 120 dias',
  'Avaliação de qualidade de covas',
  'Avaliação de Distância de Covas',
];

// Distance ranges
export const MIN_STREET_DISTANCE = 2.70;
export const MAX_STREET_DISTANCE = 3.30;
export const MIN_LINE_DISTANCE = 1.70;
export const MAX_LINE_DISTANCE = 2.30;


// Icons
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
const WarningIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
const FireIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.657 7.343A8 8 0 0117.657 18.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1014.12 11.88a3 3 0 00-4.242 4.242z" /></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const DropIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm0 3.75a2.25 2.25 0 00-2.25 2.25c0 1.95.84 3.7 2.25 4.95 1.41-1.25 2.25-3 2.25-4.95A2.25 2.25 0 0012 6z" /></svg>;
const LeaningIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>;
const DeadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>;
const ExposedCollarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>;
const BrokenTipIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const EmptyHoleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const RulerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v4m0 0h-4m4 0l-5-5" /></svg>;

// Icons for Hole Status
const NoFertilizerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20.618 5.984A2.25 2.25 0 0118.37 8.232l-1.34 1.34a2.25 2.25 0 01-3.182 0l-3.182-3.182a2.25 2.25 0 010-3.182l1.34-1.34a2.25 2.25 0 013.182 0l3.182 3.182zM12 12l-7.5 7.5M4 4l16 16" /></svg>;
const ExposedFertilizerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="1.5"/><circle cx="16.5" cy="16.5" r="1.5"/><circle cx="7.5" cy="7.5" r="1.5"/><circle cx="16.5" cy="7.5" r="1.5"/><circle cx="7.5" cy="16.5" r="1.5"/></svg>;
const NoCrowningIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M17 8v8M7 8v8M3 8h18M3 16h18M4 4l16 16" /></svg>;
const NoDiggingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 12h5v10h10V12h5L12 2zM4 4l16 16" /></svg>;
const NoBasinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="3"/><path strokeLinecap="round" strokeLinejoin="round" d="M4 4l16 16" /></svg>;
const WrongDepthIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m-4-4l4 4 4-4m-4-10l4-4-4-4" /></svg>;


export const STATUS_DETAILS: { [key in SeedlingStatus]: { label: string; shortLabel: string; color: string; icon: React.ReactElement } } = {
  [SeedlingStatus.NotEvaluated]: { label: 'Não Avaliada', shortLabel: 'N/A', color: 'bg-slate-200 text-slate-600', icon: <></> },
  [SeedlingStatus.Ok]: { label: 'Conforme', shortLabel: 'OK', color: 'bg-green-600 text-white', icon: <CheckIcon /> },
  [SeedlingStatus.PoorlyFixed]: { label: 'Mal Fixada', shortLabel: 'Fix', color: 'bg-amber-500 text-white', icon: <WarningIcon /> },
  [SeedlingStatus.FertilizerBurn]: { label: 'Queimada por Adubo', shortLabel: 'Adu', color: 'bg-red-600 text-white', icon: <FireIcon /> },
  [SeedlingStatus.HerbicideBurn]: { label: 'Queimada por Herbicida', shortLabel: 'Her', color: 'bg-rose-600 text-white', icon: <XIcon /> },
  [SeedlingStatus.DrownedCollar]: { label: 'Coleto Afogado', shortLabel: 'Col', color: 'bg-yellow-500 text-white', icon: <DropIcon /> },
  [SeedlingStatus.LeaningSeedling]: { label: 'Muda Inclinada', shortLabel: 'Incl', color: 'bg-teal-500 text-white', icon: <LeaningIcon /> },
  [SeedlingStatus.DeadSeedling]: { label: 'Muda Morta', shortLabel: 'Mort', color: 'bg-gray-700 text-white', icon: <DeadIcon /> },
  [SeedlingStatus.ExposedCollar]: { label: 'Coleto Exposto', shortLabel: 'Exp', color: 'bg-orange-500 text-white', icon: <ExposedCollarIcon /> },
  [SeedlingStatus.BrokenTip]: { label: 'Ponteiro Quebrado', shortLabel: 'Queb', color: 'bg-purple-600 text-white', icon: <BrokenTipIcon /> },
  [SeedlingStatus.EmptyHole]: { label: 'Cova sem Muda', shortLabel: 'Vazia', color: 'bg-stone-500 text-white', icon: <EmptyHoleIcon /> },
};

export const HOLE_STATUS_DETAILS: { [key in HoleStatus]: { label: string; shortLabel: string; color: string; icon: React.ReactElement } } = {
  [HoleStatus.NotEvaluated]: { label: 'Não Avaliada', shortLabel: 'N/A', color: 'bg-slate-200 text-slate-600', icon: <></> },
  [HoleStatus.Ok]: { label: 'Conforme', shortLabel: 'OK', color: 'bg-green-600 text-white', icon: <CheckIcon /> },
  [HoleStatus.NoFertilizer]: { label: 'Sem Adubo', shortLabel: 'S/Adu', color: 'bg-red-500 text-white', icon: <NoFertilizerIcon /> },
  [HoleStatus.ExposedFertilizer]: { label: 'Adubo Exposto', shortLabel: 'AduExp', color: 'bg-orange-500 text-white', icon: <ExposedFertilizerIcon /> },
  [HoleStatus.NoCrowning]: { label: 'Sem Coroamento', shortLabel: 'S/Cor', color: 'bg-yellow-500 text-white', icon: <NoCrowningIcon /> },
  [HoleStatus.NoDigging]: { label: 'Sem Coveamento', shortLabel: 'S/Cov', color: 'bg-amber-600 text-white', icon: <NoDiggingIcon /> },
  [HoleStatus.NoBasin]: { label: 'Sem Coveta', shortLabel: 'S/Cvt', color: 'bg-cyan-500 text-white', icon: <NoBasinIcon /> },
  [HoleStatus.WrongDepth]: { label: 'Profundidade Errada', shortLabel: 'Prof', color: 'bg-blue-500 text-white', icon: <WrongDepthIcon /> },
};

export const DISTANCE_STATUS_DETAILS: { [key in DistanceStatus]?: { label: string; color: string; } } = {
  [DistanceStatus.Ok]: { label: 'Conforme', color: 'bg-green-600 text-white' },
  [DistanceStatus.StreetProblem]: { label: 'Problema na Rua', color: 'bg-red-500 text-white' },
  [DistanceStatus.LineProblem]: { label: 'Problema na Linha', color: 'bg-amber-500 text-white' },
  [DistanceStatus.BothProblem]: { label: 'Problema em Ambos', color: 'bg-purple-600 text-white' },
};

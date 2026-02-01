
export enum Screen {
  Setup,
  Evaluation,
  Results,
  History,
}

export enum SeedlingStatus {
  NotEvaluated = 'NÃO AVALIADA',
  Ok = 'CONFORME',
  PoorlyFixed = 'MAL FIXADA',
  FertilizerBurn = 'QUEIMADA POR ADUBO',
  HerbicideBurn = 'QUEIMADA POR HERBICIDA',
  DrownedCollar = 'COLETO AFOGADO',
  LeaningSeedling = 'MUDA INCLINADA',
  DeadSeedling = 'MUDA MORTA',
  ExposedCollar = 'COLETO EXPOSTO',
  BrokenTip = 'PONTEIRO QUEBRADO',
  EmptyHole = 'COVA SEM MUDA',
}

export enum HoleStatus {
  NotEvaluated = 'NÃO AVALIADA',
  Ok = 'CONFORME',
  NoFertilizer = 'SEM ADUBO',
  ExposedFertilizer = 'ADUBO EXPOSTO',
  NoCrowning = 'SEM COROAMENTO',
  NoDigging = 'SEM COVEAMENTO',
  NoBasin = 'SEM COVETA',
  WrongDepth = 'PROFUNDIDADE ERRADA',
}

export enum DistanceStatus {
  NotEvaluated = 'NÃO AVALIADA',
  Ok = 'CONFORME',
  StreetProblem = 'PROBLEMA NA RUA',
  LineProblem = 'PROBLEMA NA LINHA',
  BothProblem = 'PROBLEMA EM AMBOS',
}


export interface EvaluationData {
  id?: string;
  savedAt?: number;
  areaCode: string;
  date: string;
  type: string;
  totalSamples: number;
  samples: string[];
  measurements?: { street?: number; line?: number }[];
}

export interface ProblemDetails {
  [key: string]: {
    count: number;
    percentage: number;
  };
}

export interface EvaluationResults {
  qualityRate: number;
  problemRate: number;
  okCount: number;
  problemCount: number;
  problemDetails: ProblemDetails;
}

import { EvaluationData, SeedlingStatus, HoleStatus, DistanceStatus } from '../types';

// Declare XLSX from the CDN script to satisfy TypeScript
declare var XLSX: any;

export const exportToExcel = (evaluations: EvaluationData[], fileName: string) => {
    const dataForExport = evaluations.map(evaluation => {
        const isHoleQualityEval = evaluation.type === 'Avaliação de qualidade de covas';
        const isDistanceEval = evaluation.type === 'Avaliação de Distância de Covas';

        const total = evaluation.totalSamples;
        let okStatus: string = SeedlingStatus.Ok;

        if (isHoleQualityEval) {
            okStatus = HoleStatus.Ok;
        } else if (isDistanceEval) {
            okStatus = DistanceStatus.Ok;
        }

        const okCount = evaluation.samples.filter(s => s === okStatus).length;
        const qualityRate = total > 0 ? (okCount / total) * 100 : 0;
        const problemRate = 100 - qualityRate;

        const isSeedlingEval = !isHoleQualityEval && !isDistanceEval;

        // Seedling counts
        const poorlyFixedCount = isSeedlingEval ? evaluation.samples.filter(s => s === SeedlingStatus.PoorlyFixed).length : 0;
        const fertilizerBurnCount = isSeedlingEval ? evaluation.samples.filter(s => s === SeedlingStatus.FertilizerBurn).length : 0;
        const herbicideBurnCount = isSeedlingEval ? evaluation.samples.filter(s => s === SeedlingStatus.HerbicideBurn).length : 0;
        const drownedCollarCount = isSeedlingEval ? evaluation.samples.filter(s => s === SeedlingStatus.DrownedCollar).length : 0;
        const leaningSeedlingCount = isSeedlingEval ? evaluation.samples.filter(s => s === SeedlingStatus.LeaningSeedling).length : 0;
        const deadSeedlingCount = isSeedlingEval ? evaluation.samples.filter(s => s === SeedlingStatus.DeadSeedling).length : 0;
        const exposedCollarCount = isSeedlingEval ? evaluation.samples.filter(s => s === SeedlingStatus.ExposedCollar).length : 0;
        const brokenTipCount = isSeedlingEval ? evaluation.samples.filter(s => s === SeedlingStatus.BrokenTip).length : 0;
        const emptyHoleCount = isSeedlingEval ? evaluation.samples.filter(s => s === SeedlingStatus.EmptyHole).length : 0;
        
        // Hole Quality counts
        const noFertilizerCount = isHoleQualityEval ? evaluation.samples.filter(s => s === HoleStatus.NoFertilizer).length : 0;
        const exposedFertilizerCount = isHoleQualityEval ? evaluation.samples.filter(s => s === HoleStatus.ExposedFertilizer).length : 0;
        const noCrowningCount = isHoleQualityEval ? evaluation.samples.filter(s => s === HoleStatus.NoCrowning).length : 0;
        const noDiggingCount = isHoleQualityEval ? evaluation.samples.filter(s => s === HoleStatus.NoDigging).length : 0;
        const noBasinCount = isHoleQualityEval ? evaluation.samples.filter(s => s === HoleStatus.NoBasin).length : 0;
        const wrongDepthCount = isHoleQualityEval ? evaluation.samples.filter(s => s === HoleStatus.WrongDepth).length : 0;

        // Distance counts
        const streetProblemCount = isDistanceEval ? evaluation.samples.filter(s => s === DistanceStatus.StreetProblem || s === DistanceStatus.BothProblem).length : 0;
        const lineProblemCount = isDistanceEval ? evaluation.samples.filter(s => s === DistanceStatus.LineProblem || s === DistanceStatus.BothProblem).length : 0;

        return {
            'ID da Avaliação': evaluation.id,
            'Código da Área': evaluation.areaCode,
            'Tipo de Avaliação': evaluation.type,
            'Taxa de Qualidade (%)': qualityRate.toFixed(1),
            'Taxa de Problemas (%)': problemRate.toFixed(1),
            'Mal Fixada (Qtd)': poorlyFixedCount,
            'Queimada por Adubo (Qtd)': fertilizerBurnCount,
            'Queimada por Herbicida (Qtd)': herbicideBurnCount,
            'Coleto Afogado (Qtd)': drownedCollarCount,
            'Muda Inclinada (Qtd)': leaningSeedlingCount,
            'Muda Morta (Qtd)': deadSeedlingCount,
            'Coleto Exposto (Qtd)': exposedCollarCount,
            'Ponteiro Quebrado (Qtd)': brokenTipCount,
            'Cova sem Muda (Qtd)': emptyHoleCount,
            'Sem Adubo (Qtd)': noFertilizerCount,
            'Adubo Exposto (Qtd)': exposedFertilizerCount,
            'Sem Coroamento (Qtd)': noCrowningCount,
            'Sem Coveamento (Qtd)': noDiggingCount,
            'Sem Coveta (Qtd)': noBasinCount,
            'Profundidade Errada (Qtd)': wrongDepthCount,
            'Problema de Rua (Qtd)': streetProblemCount,
            'Problema de Linha (Qtd)': lineProblemCount,
        };
    });

    const ws = XLSX.utils.json_to_sheet(dataForExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Relatório de Avaliações');

    XLSX.writeFile(wb, `${fileName}.xlsx`);
};
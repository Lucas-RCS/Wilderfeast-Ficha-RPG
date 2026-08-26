import { StyleKey, SkillKey, RollResult } from '../types';

export interface RollInput {
  styleName?: string;
  style?: StyleKey;
  styleDiceCount?: number;
  styleValue?: number;
  skillName?: string;
  skill?: SkillKey;
  skillBonus?: number;
  actionDieType: 'd8' | 'd20';
  hasAdvantage?: boolean;
  hasDisadvantage?: boolean;
  advantageState?: 'normal' | 'vantagem' | 'desvantagem';
  modifier?: number;
  reason?: string;
  traitUsed?: string;
}

export function executeWilderfeastRoll(input: RollInput): RollResult {
  const style = (input.style || (input.styleName?.toLowerCase() as StyleKey) || 'ligeiro') as StyleKey;
  const rawPool = input.styleDiceCount ?? input.styleValue ?? 1;
  const skill = input.skill || (input.skillName ? (input.skillName.toLowerCase() as SkillKey) : undefined);
  const skillBonus = input.skillBonus ?? 0;
  const actionDieType = input.actionDieType || 'd8';
  
  let advantageState: 'normal' | 'vantagem' | 'desvantagem' = 'normal';
  if (input.advantageState) {
    advantageState = input.advantageState;
  } else if (input.hasAdvantage) {
    advantageState = 'vantagem';
  } else if (input.hasDisadvantage) {
    advantageState = 'desvantagem';
  }

  // d6 dice pool count (with Advantage/Disadvantage modifier if applicable)
  let effectiveD6Count = rawPool;
  if (advantageState === 'vantagem') {
    effectiveD6Count += 1;
  } else if (advantageState === 'desvantagem') {
    effectiveD6Count = Math.max(1, effectiveD6Count - 1);
  }

  // Roll d6s
  const styleDiceRolls: number[] = [];
  for (let i = 0; i < effectiveD6Count; i++) {
    styleDiceRolls.push(Math.floor(Math.random() * 6) + 1);
  }

  // Roll Action Die (d8 or d20)
  const maxActionDie = actionDieType === 'd8' ? 8 : 20;
  const rawActionDieRoll = Math.floor(Math.random() * maxActionDie) + 1;

  // Threshold: 5 or 6 are successes
  const successThreshold = 5;
  const naturalSuccesses = styleDiceRolls.filter(d => d >= successThreshold).length;

  // Final successes count
  const successesCount = naturalSuccesses;
  const extraSuccesses = Math.max(0, successesCount - 1);
  const totalScore = rawActionDieRoll + skillBonus + (input.modifier || 0);
  const isSuccess = successesCount > 0;

  let successQuality: 'falha' | 'parcial' | 'padrao' | 'critico' = 'falha';
  if (isSuccess) {
    if (totalScore <= 4) successQuality = 'parcial';
    else if (totalScore <= 7) successQuality = 'padrao';
    else successQuality = 'critico';
  }

  let outcomeSummary = '';
  if (!isSuccess) {
    outcomeSummary = `FALHA (0 Sucessos nos ${effectiveD6Count}d6). Consequência: O monstro reage, ou você sofre -2 de Vigor/Condição.`;
  } else {
    outcomeSummary = `SUCESSO com [A] = ${rawActionDieRoll} (+${skillBonus} de Habilidade = Total ${totalScore}). Sucessos nos dados: ${successesCount}.`;
  }

  return {
    id: `roll-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    style,
    styleDiceCount: effectiveD6Count,
    skill,
    skillBonus,
    actionDieType,
    actionDieRoll: rawActionDieRoll,
    styleDiceRolls,
    advantageState,
    successThreshold,
    successesCount,
    extraSuccesses,
    totalScore,
    actionScore: totalScore,
    isSuccess,
    successQuality,
    outcomeSummary,
    traitUsed: input.traitUsed
  };
}

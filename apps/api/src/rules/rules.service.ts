import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export type RulesDecision = {
  matchedRules: string[];
  reason: string;
  stage?: 'SOFT' | 'HARD' | 'LEGAL';
  assignedTo?: string;
  assignGroup?: string;
};

type RuleCondition = {
  dpdMin?: number;
  dpdMax?: number;
  riskScoreMin?: number;
};

type RuleThen = {
  stage?: 'SOFT' | 'HARD' | 'LEGAL';
  assignedTo?: string;
  assignGroup?: string;
};

type Rule = {
  id: string;
  priority: number;
  conditions: RuleCondition;
  then: RuleThen;
};

@Injectable()
export class RulesService {
  private rules: Rule[] = [];

  constructor() {
    this.rules = this.loadRules();
  }

  loadRules(): Rule[] {
    const rulesPath = path.join(__dirname, 'delinquency-rules.json');
    const raw = fs.readFileSync(rulesPath, 'utf-8');
    const rules = JSON.parse(raw) as Rule[];
    return rules.sort((a, b) => a.priority - b.priority);
  }

  evaluateRules(input: { dpd: number; riskScore: number }): RulesDecision {
    const matchedRules: string[] = [];
    let stage: RulesDecision['stage'];
    let assignGroup: string | undefined;
    let assignedTo: string | undefined;
    const reasons: string[] = [];

    for (const rule of this.rules) {
      if (this.matches(rule.conditions, input)) {
        matchedRules.push(rule.id);
        if (rule.then.stage) {
          stage = rule.then.stage;
        }
        if (rule.then.assignGroup) {
          assignGroup = rule.then.assignGroup;
        }
        if (rule.then.assignedTo) {
          assignedTo = rule.then.assignedTo;
        }
        reasons.push(this.toReason(rule, input));
      }
    }

    return {
      matchedRules,
      reason: reasons.join('; '),
      stage,
      assignedTo,
      assignGroup,
    };
  }

  private matches(conditions: RuleCondition, input: { dpd: number; riskScore: number }): boolean {
    if (conditions.dpdMin !== undefined && input.dpd < conditions.dpdMin) return false;
    if (conditions.dpdMax !== undefined && input.dpd > conditions.dpdMax) return false;
    if (conditions.riskScoreMin !== undefined && input.riskScore < conditions.riskScoreMin) return false;
    return true;
  }

  private toReason(rule: Rule, input: { dpd: number; riskScore: number }): string {
    const parts: string[] = [];
    if (rule.conditions.dpdMin !== undefined || rule.conditions.dpdMax !== undefined) {
      if (rule.id === 'DPD_GT_30') {
        parts.push(`dpd=${input.dpd} -> Legal`);
      } else {
        parts.push(`dpd=${input.dpd} -> ${rule.then.assignGroup ?? 'Tier'}`);
      }
    }
    if (rule.conditions.riskScoreMin !== undefined) {
      parts.push(`riskScore=${input.riskScore} -> SeniorAgent override`);
    }
    return parts.join('; ');
  }
}

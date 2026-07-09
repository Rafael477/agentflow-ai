export interface SlaThresholds {
  warning: number;
  urgent: number;
  critical: number;
}

export const DEFAULT_SLA_THRESHOLDS: SlaThresholds = {
  warning: 10,
  urgent: 30,
  critical: 60
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readPositiveMinutes(value: unknown, fallback: number): number {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(1, Math.floor(parsed));
}

export function normalizeSlaThresholds(value: unknown): SlaThresholds {
  if (!isRecord(value)) return DEFAULT_SLA_THRESHOLDS;

  const warning = readPositiveMinutes(value.warning, DEFAULT_SLA_THRESHOLDS.warning);
  const urgent = Math.max(readPositiveMinutes(value.urgent, DEFAULT_SLA_THRESHOLDS.urgent), warning + 1);
  const critical = Math.max(readPositiveMinutes(value.critical, DEFAULT_SLA_THRESHOLDS.critical), urgent + 1);

  return { warning, urgent, critical };
}

export function getSlaThresholdsFromSettings(settings: unknown): SlaThresholds {
  if (!isRecord(settings)) return DEFAULT_SLA_THRESHOLDS;
  return normalizeSlaThresholds(settings.sla);
}

export function mergeSlaThresholdsIntoSettings(settings: unknown, thresholds: SlaThresholds): Record<string, unknown> {
  const current = isRecord(settings) ? settings : {};
  return {
    ...current,
    sla: normalizeSlaThresholds(thresholds)
  };
}

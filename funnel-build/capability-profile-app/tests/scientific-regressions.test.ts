import { describe, expect, it } from 'vitest';
import { products } from '../src/data/catalog';
import { readinessQuestions, validateReadinessQuestions } from '../src/data/readinessQuestions';
import { evaluateFit, visibleReadinessQuestions } from '../src/domain/fit';
import { initialState } from '../src/state/reducer';
import type { McqAnswer } from '../src/types/readiness';

// Independent fixtures transcribed from the live Approved / Current V4 records
// on 8 September 2026, checked against the completed Puretronics questionnaire.
// These values deliberately do not import the application's model mappings.
const diameterModels = [
  ['P01A', 0.8, 35], ['P01B', 1, 150], ['P02A', 0.1, 12], ['P02B', 0.1, 30],
  ['P02C', 0.5, 65], ['P03A', 0.1, 10], ['P03B', 0.3, 20], ['P03C', 0.3, 30],
] as const;
const sparkModels = [
  ['P04A', 200, 30, 60], ['P04B', 1500, 15, 15], ['P04C', 2500, 20, 30],
] as const;
const preheaterModels = [['P07A', 0.4, 3.6, 1000], ['P07B', 0.5, 2.8, 1500], ['P07C', 0.3, 1.4, 2000]] as const;
const powderModels = [['P08A', 150, 40], ['P08B', 250, 40], ['P08C', 400, 40], ['P08D', 150, 100], ['P08E', 150, 40], ['P08F', 100, 100]] as const;
const indicatorModels = [['P10A', 0.2, 5], ['P10B', 2, 10]] as const;
const brakeModels = [['P13A', 0.15, 16, 2500], ['P13B', 0.25, 27, 1500], ['P13C', 0.33, 33, 1200]] as const;
const loadcellSeries = [
  ['P12A', [10, 20, 50, 100], 'flange'], ['P12B', [50, 100, 200, 500], 'flange'],
  ['P12C', [50, 100, 200, 500], 'flange-pilot'], ['P12D', [100, 200, 500, 1000], 'pillow-block'],
  ['P12E', [10, 20, 50], 'flange'], ['P12F', [100, 500, 1000, 2000, 5000], 'pillow-block'],
] as const;

const stateFor = (selectedProducts: string[], readinessAnswers: Record<string, McqAnswer>) => ({ ...initialState, selectedProducts, readinessAnswers });
const fit = (productId: string, answers: Record<string, McqAnswer>) => evaluateFit(stateFor([productId], answers)).find((result) => result.productId === productId)!;
const samples = (limits: number[]) => [...new Set(limits.flatMap((value) => [value - 0.00001, value, value + 0.00001]))];
const sorted = (values: readonly string[]) => [...values].sort();
const upperBand = (value: number, bands: Array<[number, string]>, above: string) => bands.find(([limit]) => value <= limit)?.[1] ?? above;
const lowerBand = (value: number, bands: Array<[number, string]>, above: string) => bands.find(([limit]) => value < limit)?.[1] ?? above;

describe('independent numerical boundary audit', () => {
  for (const value of samples([0.1, 0.3, 0.5, 0.8, 1])) it(`measurement minimum ${value} mm uses each model lower bound`, () => {
    const option = lowerBand(value, [[0.1, 'below-0-1'], [0.3, '0-1-to-below-0-3'], [0.5, '0-3-to-below-0-5'], [0.8, '0-5-to-below-0-8'], [1, '0-8-to-below-1']], '1-or-more');
    const actual = evaluateFit(stateFor(['P01','P02','P03'], { 'pf01-min-diameter': option })).flatMap((result) => result.modelIds);
    expect(sorted(actual)).toEqual(sorted(diameterModels.filter(([, min]) => value >= min).map(([id]) => id)));
  });
  for (const value of samples([10, 12, 20, 30, 35, 65, 150])) it(`measurement maximum ${value} mm uses each model upper bound`, () => {
    const option = upperBand(value, [[10, 'up-to-10'], [12, '10-12'], [20, '12-20'], [30, '20-30'], [35, '30-35'], [65, '35-65'], [150, '65-150']], 'above-150');
    const actual = evaluateFit(stateFor(['P01','P02','P03'], { 'pf01-max-diameter': option })).flatMap((result) => result.modelIds);
    expect(sorted(actual)).toEqual(sorted(diameterModels.filter(([, , max]) => value <= max).map(([id]) => id)));
  });
  for (const value of samples([200, 1500, 2500])) it(`spark speed ${value} m/min preserves method-specific maxima`, () => {
    const option = upperBand(value, [[200, 'up-to-200'], [1500, '200-1500'], [2500, '1500-2500']], 'above-2500');
    expect(fit('P04', { 'pf02-speed': option }).modelIds).toEqual(sparkModels.filter(([, max]) => value <= max).map(([id]) => id));
  });
  for (const value of samples([1.5, 10, 15, 20, 25, 30])) it(`spark voltage ${value} kV keeps the AC/HF/DC limits separate`, () => {
    const option = value < 1.5 ? 'below-1-5' : upperBand(value, [[10, 'up-to-10'], [15, '10-15'], [20, '15-20'], [25, '20-25'], [30, '25-30']], 'above-30');
    expect(fit('P04', { 'pf02-voltage': option }).modelIds).toEqual(sparkModels.filter(([, , max]) => value >= 1.5 && value <= max).map(([id]) => id));
  });
  for (const value of samples([0.5, 15, 30, 40, 60])) it(`spark diameter ${value} mm preserves standard and on-demand limits`, () => {
    const option = value < 0.5 ? 'below-0-5' : upperBand(value, [[15, 'up-to-15'], [30, '15-30'], [40, '30-40'], [60, '40-60']], 'above-60');
    expect(fit('P04', { 'pf02-diameter': option }).modelIds).toEqual(sparkModels.filter(([, , , max]) => value >= 0.5 && value <= max).map(([id]) => id));
  });
  for (const value of samples([0.1, 0.3, 0.4, 0.5])) it(`preheater minimum ${value} mm does not confuse a class with the configurable product`, () => {
    const option = lowerBand(value, [[0.1, 'below-0-1'], [0.3, 'below-0-3'], [0.4, '0-3-to-below-0-4'], [0.5, '0-4-to-below-0-5']], '0-5-or-more');
    const result = fit('P07', { 'pf04-path': 'preheat', 'pf04-preheat-min-size': option });
    expect(result.modelIds).toEqual(preheaterModels.filter(([, min]) => value >= min).map(([id]) => id));
    expect(result.status).toBe(value < 0.1 ? 'excluded' : 'project-review');
  });
  for (const value of samples([1.4, 2.8, 3.6, 10, 16])) it(`preheater maximum ${value} mm checks the wider bunched-conductor envelope`, () => {
    const option = upperBand(value, [[1.4, 'up-to-1-4'], [2.8, '1-4-to-2-8'], [3.6, '2-8-to-3-6'], [10, 'above-3-6'], [16, '10-16']], 'above-16');
    const result = fit('P07', { 'pf04-path': 'preheat', 'pf04-preheat-construction': 'bunched', 'pf04-preheat-max-size': option });
    expect(result.modelIds).toEqual(preheaterModels.filter(([, , max]) => value <= max).map(([id]) => id));
    expect(result.status).toBe(value > 16 ? 'excluded' : 'project-review');
  });
  for (const value of samples([40, 100, 150, 250, 400, 1000, 1500, 2000])) it(`shared process speed ${value} m/min applies independently to preheaters and powder applicators`, () => {
    const option = value < 40 ? 'below-40' : upperBand(value, [[100, 'up-to-100'], [150, '100-150'], [250, '150-250'], [400, '250-400'], [1000, '400-1000'], [1500, '1000-1500'], [2000, '1500-2000']], 'above-2000');
    const result = evaluateFit(stateFor(['P07','P08'], { 'pf04-path': ['preheat','talc','graphite'], 'pf04-speed': option }));
    expect(result.find((item) => item.productId === 'P07')!.modelIds).toEqual(preheaterModels.filter(([, , , max]) => value >= 40 && value <= max).map(([id]) => id));
    expect(result.find((item) => item.productId === 'P08')!.modelIds).toEqual(powderModels.filter(([, max]) => value <= max).map(([id]) => id));
  });
  for (const value of samples([60, 180])) it(`preheater temperature ${value} °C preserves the current envelope`, () => {
    const within = value >= 60 && value <= 180;
    const result = fit('P07', { 'pf04-path': 'preheat', 'pf04-temperature': within ? '60-180' : 'outside' });
    expect(result.status).toBe(within ? 'project-review' : 'excluded');
    expect(result.modelIds).toHaveLength(within ? 3 : 0);
  });
  for (const value of samples([40, 100])) it(`powder size ${value} mm preserves all six variant limits`, () => {
    const option = upperBand(value, [[40, 'up-to-40'], [100, '40-100']], 'above-100');
    expect(fit('P08', { 'pf04-path': ['talc','graphite'], 'pf04-powder-size': option }).modelIds).toEqual(powderModels.filter(([, , max]) => value <= max).map(([id]) => id));
  });
  for (const value of samples([0.2, 6])) it(`butt-welding area ${value} mm² checks area, not diameter`, () => {
    const option = value < 0.2 ? 'below-0-2' : value <= 6 ? '0-2-to-6' : 'above-6';
    expect(fit('P09', { 'pf04-path': 'joining', 'pf04-joining-size': option }).status).toBe(value >= 0.2 && value <= 6 ? 'potential' : 'excluded');
  });
  for (const value of samples([0.2, 2, 5, 10])) it(`tension-indicator wire size ${value} mm checks each model`, () => {
    const option = value < 0.2 ? 'below-0-2' : value < 2 ? '0-2-2' : value <= 5 ? '2-5' : value <= 10 ? '5-10' : 'above-10';
    expect(fit('P10', { 'pf05-role': 'indication', 'pf05-indicator-size': option }).modelIds).toEqual(indicatorModels.filter(([, min, max]) => value >= min && value <= max).map(([id]) => id));
  });
  for (const value of samples([15, 40])) it(`tension-indicator demand ${value} kg stays configuration-dependent`, () => {
    const option = value <= 15 ? 'up-to-15' : value <= 40 ? '15-to-40' : 'above-40';
    const result = fit('P10', { 'pf05-role': 'indication', 'pf05-indicator-tension': option });
    expect(result.status).toBe('project-review');
    expect(result.modelIds).toEqual(['P10A','P10B']);
  });
  for (const value of samples([0.15, 0.25, 0.33, 16, 27, 33])) it(`brake per-caliper torque ${value} kg·m uses each model interval`, () => {
    const option = value < 0.15 ? 'below-0-15' : value < 0.25 ? '0-15-0-24' : value < 0.33 ? '0-25-0-32' : upperBand(value, [[16, '0-33-16'], [27, '16-27'], [33, '27-33']], 'above-33');
    expect(fit('P13', { 'pf05-role': 'braking', 'pf05-torque-basis': 'per-caliper', 'pf05-torque': option }).modelIds).toEqual(brakeModels.filter(([, min, max]) => value >= min && value <= max).map(([id]) => id));
  });
  for (const value of samples([1200, 1500, 2500])) it(`brake shaft speed ${value} rpm uses each model maximum`, () => {
    const option = upperBand(value, [[1200, 'up-to-1200'], [1500, '1200-1500'], [2500, '1500-2500']], 'above-2500');
    expect(fit('P13', { 'pf05-role': 'braking', 'pf05-rpm': option }).modelIds).toEqual(brakeModels.filter(([, , , max]) => value <= max).map(([id]) => id));
  });
  for (const value of samples([0.2, 6])) it(`brake pressure ${value} bar is only an operating-envelope screen`, () => {
    const within = value >= 0.2 && value <= 6;
    const result = fit('P13', { 'pf05-role': 'braking', 'pf05-air': within ? 'within-range' : 'outside-range' });
    expect(result.status).toBe(within ? 'project-review' : 'excluded');
    expect(result.modelIds).toHaveLength(within ? 3 : 0);
  });
  for (const value of samples([40])) it(`offline AC voltage ${value} kV becomes request-based above 40`, () => {
    const result = fit('P05', { 'pf03-path': 'ac', 'pf03-ac-voltage': value <= 40 ? '20-40' : 'above-40' });
    expect(result.modelIds).toEqual(['P05A']);
    expect(result.status).toBe(value > 40 ? 'project-review' : 'potential');
  });
  for (const value of samples([0.001, 1])) it(`offline AC current ${value} A becomes request-based above 1 A`, () => {
    const result = fit('P05', { 'pf03-path': 'ac', 'pf03-ac-current': value <= 0.001 ? 'up-to-1ma' : value <= 1 ? '1ma-1a' : 'above-1a' });
    expect(result.modelIds).toEqual(['P05A']);
    expect(result.status).toBe(value > 1 ? 'project-review' : 'potential');
  });
  for (const value of samples([0.5, 20])) it(`offline DC voltage ${value} kV becomes request-based outside its own range`, () => {
    const within = value >= 0.5 && value <= 20;
    const result = fit('P05', { 'pf03-path': 'dc', 'pf03-dc-voltage': within ? '0-5-to-20' : 'other' });
    expect(result.modelIds).toEqual(['P05B']);
    expect(result.status).toBe(within ? 'potential' : 'project-review');
  });
  for (const value of samples([0.001])) it(`offline DC current ${value} A is not generalised from AC`, () => {
    const result = fit('P05', { 'pf03-path': 'dc', 'pf03-dc-current': value === 0.001 ? '1ma' : 'other' });
    expect(result.modelIds).toEqual(['P05B']);
    expect(result.status).toBe(value === 0.001 ? 'potential' : 'project-review');
  });
});

describe('scientific intersections, uncertainty and equipment-role isolation', () => {
  it('validates every explicit product scope and reference', () => expect(validateReadinessQuestions()).toEqual([]));
  it('keeps a spark answer from excluding measurement, powder, or braking products', () => {
    const result = evaluateFit(stateFor(['P01','P04','P08','P13'], { 'pf02-voltage': 'above-30' }));
    expect(result.find((item) => item.productId === 'P04')!.status).toBe('excluded');
    for (const id of ['P01','P08','P13']) expect(result.find((item) => item.productId === id)!.status).not.toBe('excluded');
  });
  it('scopes every single known option to its own products even with the whole portfolio carried', () => {
    for (const question of readinessQuestions.filter((item) => item.productIds)) for (const option of question.options) {
      const answers: Record<string, McqAnswer> = { [question.id]: option.id };
      if (question.when) answers[question.when.questionId] = question.when.optionIds[0];
      const baseline = { ...answers };
      delete baseline[question.id];
      const before = evaluateFit(stateFor(products.map((product) => product.id), baseline));
      const after = evaluateFit(stateFor(products.map((product) => product.id), answers));
      for (const product of products.filter((item) => !question.productIds!.includes(item.id))) {
        const prior = before.find((item) => item.productId === product.id)!;
        const next = after.find((item) => item.productId === product.id)!;
        expect(next.modelIds, `${question.id}/${option.id} changed ${product.name}`).toEqual(prior.modelIds);
        expect(next.status, `${question.id}/${option.id} changed ${product.name}`).toEqual(prior.status);
      }
    }
  });
  it('intersects smallest and largest measurement requirements across different products', () => {
    const results = evaluateFit(stateFor(['P01','P02','P03'], { 'pf01-min-diameter': '0-1-to-below-0-3', 'pf01-max-diameter': '20-30' }));
    expect(results.flatMap((result) => result.modelIds)).toEqual(['P02B']);
  });
  it('keeps lump-and-neck detection limited to LASER-H', () => {
    const results = evaluateFit(stateFor(['P01','P02','P03'], { 'pf01-function': 'lump-neck' }));
    expect(results.filter((result) => result.status !== 'excluded').map((result) => result.productId)).toEqual(['P03']);
  });
  it('excludes powder applicators above their maximum even when the common speed band contains only preheaters', () => {
    expect(fit('P08', { 'pf04-path': 'talc', 'pf04-speed': '400-1000' }).status).toBe('excluded');
  });
  it('keeps the configurable preheater when no standard diameter/speed intersection survives', () => {
    const result = fit('P07', { 'pf04-path': 'preheat', 'pf04-speed': '1500-2000', 'pf04-preheat-min-size': '0-5-or-more', 'pf04-preheat-max-size': '1-4-to-2-8', 'pf04-temperature': '60-180' });
    expect(result.modelIds).toEqual([]);
    expect(result.status).toBe('project-review');
  });
  it('distinguishes the configurable solid and bunched preheater diameter envelopes', () => {
    expect(fit('P07', { 'pf04-path': 'preheat', 'pf04-preheat-max-size': '10-16', 'pf04-preheat-construction': 'solid' }).status).toBe('excluded');
    expect(fit('P07', { 'pf04-path': 'preheat', 'pf04-preheat-max-size': '10-16', 'pf04-preheat-construction': 'bunched' }).status).toBe('project-review');
    expect(fit('P07', { 'pf04-path': 'preheat', 'pf04-preheat-max-size': '10-16', 'pf04-preheat-construction': 'unknown' }).status).toBe('project-review');
  });
  it('keeps offline AC and DC electrical requirements independent in a combined laboratory project', () => {
    const result = fit('P05', { 'pf03-path': ['ac','dc'], 'pf03-ac-voltage': '20-40', 'pf03-ac-current': '1ma-1a', 'pf03-dc-voltage': '0-5-to-20', 'pf03-dc-current': '1ma' });
    expect(result.modelIds).toEqual(['P05A','P05B']);
    expect(result.status).toBe('potential');
  });
  it('requires the lowest spark voltage and smallest diameter as well as upper limits', () => {
    for (const [question, option] of [['pf02-min-voltage','below-1-5'], ['pf02-min-diameter','below-0-5']]) {
      expect(fit('P04', { 'pf02-principle': 'live', 'pf02-voltage': 'up-to-10', 'pf02-diameter': 'up-to-15', [question]: option }).status).toBe('excluded');
    }
  });
  it('separates standard Live coverage from on-demand DC coverage at the same diameter', () => {
    expect(fit('P04', { 'pf02-principle': 'live', 'pf02-diameter': '15-30' }).status).toBe('potential');
    expect(fit('P04', { 'pf02-principle': 'dc', 'pf02-diameter': '15-30' }).status).toBe('project-review');
  });
  it('does not compare total system torque against a per-caliper maximum', () => {
    const result = fit('P13', { 'pf05-role': 'braking', 'pf05-torque-basis': 'total-only', 'pf05-torque': 'above-33' });
    expect(result.modelIds).toHaveLength(3);
    expect(result.status).toBe('project-review');
    expect(result.openQuestionIds).toContain('pf05-torque');
  });
  it('uses brake speed and per-caliper torque together when the basis is known', () => {
    const result = fit('P13', { 'pf05-role': 'braking', 'pf05-torque-basis': 'per-caliper', 'pf05-rpm': '1200-1500', 'pf05-torque': '27-33' });
    expect(result.status).toBe('excluded');
    expect(result.modelIds).toEqual([]);
  });
  for (const capacity of [10,20,50,100,200,500,1000,2000,5000]) for (const mounting of ['flange','flange-pilot','pillow-block']) it(`loadcell ${capacity} kg + ${mounting} retains only exact combinations`, () => {
    const expected = loadcellSeries.filter(([, capacities, mount]) => (capacities as readonly number[]).includes(capacity) && mount === mounting).map(([id]) => id);
    const result = fit('P12', { 'pf05-role': 'sensing', 'pf05-capacity': `${capacity}`, 'pf05-mounting': mounting });
    expect(result.modelIds).toEqual(expected);
    expect(result.variantIds).toEqual(expected.map((id) => `${id}-C${capacity}`));
    if (!expected.length) expect(result.status).toBe('excluded');
  });
  it('covers exactly the 24 currently approved loadcell capacity options', () => {
    const expected = loadcellSeries.flatMap(([id, capacities]) => capacities.map((capacity) => `${id}-C${capacity}`));
    const actual = products.find((product) => product.id === 'P12')!.models.flatMap((model) => model.children ?? []).map((model) => model.id);
    expect(sorted(actual)).toEqual(sorted(expected));
    expect(actual).toHaveLength(24);
  });
  it('does not let a WTI limit exclude sensing, control or brake roles in an integrated review', () => {
    const results = evaluateFit(stateFor(['P10','P11','P12','P13'], { 'pf05-role': 'integrated', 'pf05-indicator-size': 'above-10' }));
    expect(results.find((result) => result.productId === 'P10')!.status).toBe('excluded');
    for (const id of ['P11','P12','P13']) expect(results.find((result) => result.productId === id)!.status).not.toBe('excluded');
  });
  it('does not let positive partial powder information create complete alignment', () => {
    const base = { 'pf04-path': 'graphite', 'pf04-speed': '100-150', 'pf04-powder-size': 'up-to-40', 'pf04-powder-specification': ['graphite-23061'], 'requirement-location': 'line', 'material-category': 'cable', 'project-type': 'new-line' };
    const all = ['powder-defined','earthing','air-quality','running-height','utilities'];
    expect(fit('P08', { ...base, 'pf04-powder-readiness': all }).status).toBe('aligned');
    for (const omitted of all) expect(fit('P08', { ...base, 'pf04-powder-readiness': all.filter((id) => id !== omitted) }).status).toBe('potential');
    expect(fit('P08', { ...base, 'pf04-powder-readiness': all, 'pf04-powder-specification': 'unknown' }).status).toBe('potential');
  });
  it('rejects a graphite/powder-specification contradiction without substituting talcum', () => {
    const result = fit('P08', { 'pf04-path': 'graphite', 'pf04-powder-specification': ['talc-2000'] });
    expect(result.status).toBe('excluded');
    expect(result.modelIds).toEqual([]);
  });
  it('keeps fire testing project-specific with open questions visible', () => {
    const result = fit('P06', { 'pf03-path': 'fire', 'pf03-fire-basis': 'partial' });
    expect(result.status).toBe('project-review');
    expect(result.openQuestionIds).toContain('pf03-fire-basis');
  });
  it('does not claim a complete welding match without cross-sectional area', () => {
    const result = fit('P09', { 'pf04-path': 'joining', 'pf04-joining-material': 'copper', 'pf04-joining-construction': 'solid' });
    expect(result.status).toBe('potential');
    expect(result.openQuestionIds).toContain('pf04-joining-size');
  });
  it('retains unknown and not-applicable technical answers as open questions without exclusion', () => {
    for (const product of products) {
      for (const answer of ['unknown','not-applicable']) {
        const result = fit(product.id, Object.fromEntries(readinessQuestions.map((question) => [question.id, answer])));
        expect(result.status, product.name).not.toBe('excluded');
        expect(result.openQuestionIds.length, product.name).toBeGreaterThan(0);
      }
    }
  });
  it('hides sibling-product conditions until they are in review scope', () => {
    const ids = visibleReadinessQuestions(stateFor(['P10'], { 'pf05-role': 'integrated' })).map((question) => question.id);
    expect(ids).toContain('pf05-indicator-size');
    expect(ids).not.toContain('pf05-capacity');
    expect(ids).not.toContain('pf05-rpm');
  });
  it('uses public model names in exclusion explanations', () => {
    const result = fit('P04', { 'pf02-principle': 'acute', 'pf02-speed': '1500-2500' });
    expect(result.exclusions.map((exclusion) => exclusion.reason).join(' ')).not.toMatch(/\bP\d{2}[A-Z]?\b|\bV4\b|record|governed/i);
  });
  it('does not apply hidden stale preheater construction answers', () => {
    const result = fit('P07', { 'pf04-path': 'unknown', 'pf04-preheat-max-size': '10-16', 'pf04-preheat-construction': 'solid' });
    expect(result.status).toBe('project-review');
    expect(result.modelIds).toHaveLength(3);
  });
  it('does not expose candidate models after a known role or route excludes the product', () => {
    expect(fit('P01', { 'pf01-function': 'lump-neck' }).modelIds).toEqual([]);
    expect(fit('P04', { 'project-type': 'laboratory' }).modelIds).toEqual([]);
  });
});

/**
 * API Types from README.md
 * Source: https://nesto-fe-exam.vercel.app/api
 */

export type ProductFamily = 'VALUE_FLEX' | 'STANDARD';
export type ProductType = 'VARIABLE' | 'FIXED';
export type ProductTerm =
  | '1_YEAR'
  | '2_YEAR'
  | '3_YEAR'
  | '4_YEAR'
  | '5_YEAR'
  | '6_YEAR'
  | '7_YEAR'
  | '10_YEAR';
export type Insurance = 'INSURED' | 'CONVENTIONAL';
export type PrepaymentOption = 'STANDARD' | 'ENHANCED';
export type RestrictionsOption =
  | 'NO_RESTRICTIONS'
  | 'SOME_RESTRICTIONS'
  | 'MORE_RESTRICTIONS';
export type HelocOption = 'HELOC_WITH' | 'HELOC_WITHOUT';
export type RateHold = '30_DAYS' | '45_DAYS' | '60_DAYS' | '90_DAYS' | '120_DAYS';

export type Product = {
  readonly id: number;
  name: string;
  family: ProductFamily;
  type: ProductType;
  term: ProductTerm;
  insurable: boolean;
  insurance: Insurance;
  prepaymentOption: PrepaymentOption;
  restrictionsOption: RestrictionsOption;
  restrictions: string;
  fixedPenaltySpread: string;
  helocOption: HelocOption;
  helocDelta: number;
  lenderName: string;
  lenderType: string;
  rateHold: RateHold;
  rate: number;
  ratePrimeVariance: number;
  bestRate: number;
  readonly created: string;
  readonly updated: string;
};

export type Applicant = {
  phone: string;
  email: string;
  firstName: string;
  lastName: string;
};

export type ApplicationType = 'NEW' | 'RENEWAL' | 'REFINANCE';

export type Application = {
  readonly id: string;
  token: string;
  type: ApplicationType;
  applicants: Applicant[];
  productId?: number;
  readonly createdAt: string;
};

export type CreateApplication = {
  productId: number;
};

/**
 * Grouped products by type for UI display
 */
export type GroupedProducts = Record<ProductType, Product[]>;


export interface ServiceResponse<D, S = undefined, T = undefined> {
  code: S;
  data?: D;
  error?: string;
  type?: T;
}

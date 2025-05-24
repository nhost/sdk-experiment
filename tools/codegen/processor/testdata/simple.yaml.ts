/**
 * This file is auto-generated. Do not edit manually.
 */

export interface SimpleObject {
  id: string,
  active: boolean,
  age: number,
  createdAt: string,
  metadata: object,
  data: string,
  tags: string[],
  parent: SimpleObject,
  children: SimpleObject[],
  status: EnumSimpleObjectStatus,
  statusCode: EnumSimpleObjectStatusCode,
  statusMixed: EnumSimpleObjectStatusMixed,
  nested: SimpleObjectNested,
};


export type EnumSimpleObjectStatus = "active" | "inactive" | "pending";


export type EnumSimpleObjectStatusCode = 0 | 1 | 2;


export type EnumSimpleObjectStatusMixed = 0 | "One" | true;


export interface SimpleObjectNested {
  nestedId: string,
  nestedData: string,
};

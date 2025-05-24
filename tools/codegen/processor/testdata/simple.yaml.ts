/**
 * This file is auto-generated. Do not edit manually.
 */

export type StatusEnum = "active" | "inactive" | "pending";


export type SimpleObjectStatus = "active" | "inactive" | "pending";


export type SimpleObjectStatusCode = 0 | 1 | 2;


export type SimpleObjectStatusMixed = 0 | "One" | true;


export interface SimpleObjectNested {
  nestedId: string,
  nestedData: string,
};


export interface SimpleObject {
  id: string,
  active: boolean,
  age: number,
  createdAt: string,
  metadata: Record<string, unknown>,
  data: string,
  tags: string[],
  parent: SimpleObject,
  children: SimpleObject[],
  relatedObjects: SimpleObject[],
  status: SimpleObjectStatus,
  statusCode: SimpleObjectStatusCode,
  statusMixed: SimpleObjectStatusMixed,
  statusRef: StatusEnum,
  nested: SimpleObjectNested,
};

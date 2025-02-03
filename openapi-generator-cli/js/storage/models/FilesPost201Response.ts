/* tslint:disable */
/* eslint-disable */
/**
 * Hasura Storage
 * Hasura Storage is amazing
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { mapValues } from '../runtime';
import type { FileMetadata } from './FileMetadata';
import {
    FileMetadataFromJSON,
    FileMetadataFromJSONTyped,
    FileMetadataToJSON,
    FileMetadataToJSONTyped,
} from './FileMetadata';

/**
 * 
 * @export
 * @interface FilesPost201Response
 */
export interface FilesPost201Response {
    /**
     * 
     * @type {Array<FileMetadata>}
     * @memberof FilesPost201Response
     */
    processedFiles?: Array<FileMetadata>;
}

/**
 * Check if a given object implements the FilesPost201Response interface.
 */
export function instanceOfFilesPost201Response(value: object): value is FilesPost201Response {
    return true;
}

export function FilesPost201ResponseFromJSON(json: any): FilesPost201Response {
    return FilesPost201ResponseFromJSONTyped(json, false);
}

export function FilesPost201ResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): FilesPost201Response {
    if (json == null) {
        return json;
    }
    return {
        
        'processedFiles': json['ProcessedFiles'] == null ? undefined : ((json['ProcessedFiles'] as Array<any>).map(FileMetadataFromJSON)),
    };
}

export function FilesPost201ResponseToJSON(json: any): FilesPost201Response {
    return FilesPost201ResponseToJSONTyped(json, false);
}

export function FilesPost201ResponseToJSONTyped(value?: FilesPost201Response | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'ProcessedFiles': value['processedFiles'] == null ? undefined : ((value['processedFiles'] as Array<any>).map(FileMetadataToJSON)),
    };
}


/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * Enum holding the name of each extended template diagnostic. The name is used as a user-meaningful
 * value for configuring the diagnostic in the project's options.
 *
 * See the corresponding `ErrorCode` for documentation about each specific error.
 * packages/compiler-cli/src/ngtsc/diagnostics/src/error_code.ts
 *
 * @publicApi
 */
export enum ExtendedTemplateDiagnosticName {
  INVALID_BANANA_IN_BOX = 'invalidBananaInBox',
  NULLISH_COALESCING_NOT_NULLABLE = 'nullishCoalescingNotNullable',
}

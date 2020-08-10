import {MissingTranslationHandler, MissingTranslationHandlerParams} from "@ngx-translate/core";

export class CustomMissingTranslationHandler extends MissingTranslationHandler {
  public handle(params: MissingTranslationHandlerParams): any {
    let result = `!${params.key}`;

    if (params.interpolateParams) {
      result += `;${Object.entries(params.interpolateParams).map(([key, value]) => `${key}:${value}`).join(";")}`;
    }

    result += "!";

    return result;
  }
}

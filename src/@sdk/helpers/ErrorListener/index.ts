import { ErrorCartTypes, ErrorCheckoutTypes } from "@sdk/jobs";
import { ApolloErrorWithUserInput } from "@sdk/react/types";

import { IErrorListener } from "./types";

export type ErrorTypes = ErrorCheckoutTypes | ErrorCartTypes;

export class ErrorListener implements IErrorListener {
  private errorListeners: Array<
    (error: ApolloErrorWithUserInput | any, type: ErrorTypes) => any
  >;

  constructor() {
    this.errorListeners = [];
  }

  addOnErrorListener = (
    func: (error: ApolloErrorWithUserInput | any, type: ErrorTypes) => any
  ) => {
    this.errorListeners.push(func);
  };

  removeOnErrorListener = (
    func: (error: ApolloErrorWithUserInput | any, type: ErrorTypes) => any
  ) => {
    this.errorListeners = this.errorListeners.filter(
      errorListenersFunc => func !== errorListenersFunc
    );
  };

  protected fireError = (
    error: ApolloErrorWithUserInput | any,
    type: ErrorTypes
  ) => {
    this.errorListeners.forEach(errorListenersFunc => {
      errorListenersFunc(error, type);
    });
  };
}
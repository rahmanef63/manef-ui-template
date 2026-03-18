import {
  type ErrorPresentationOptions,
  showErrorToast,
} from "@/shared/errors/appErrorPresentation";

export function handleFailure<T extends unknown[]>(
  callback: (...args: T) => Promise<void>,
  options: ErrorPresentationOptions = {},
) {
  return async (...args: T) => {
    try {
      await callback(...args);
    } catch (error: unknown) {
      showErrorToast(error, options);
    }
  };
}

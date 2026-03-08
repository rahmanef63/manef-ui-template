import { toast } from "@/components/ui/use-toast";
import { ConvexError } from "convex/values";

function getErrorMessage(error: unknown) {
  if (error instanceof ConvexError) {
    return error.data;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Something went wrong";
}

export function handleFailure<T extends unknown[]>(
  callback: (...args: T) => Promise<void>
) {
  return async (...args: T) => {
    try {
      await callback(...args);
    } catch (error: unknown) {
      toast({
        title: getErrorMessage(error),
        variant: "destructive",
      });
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };
}

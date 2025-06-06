import useSWR, { MutatorCallback, SWRConfiguration } from "swr";
import { IBusiness } from "@/database/businessSchema";
import { IUser } from "@/database/userSchema";
import { IRequest } from "@/database/requestSchema";
import { ISignupRequest } from "@/database/signupRequestSchema";
import { fetcher } from "@/lib/fetcher";

/**
 * Common SWR response interface with proper typing
 */
export interface SWRResponse<Data, Error> {
  data?: Data;
  error?: Error;
  isLoading: boolean;
  isValidating: boolean;
  mutate: (
    data?: Data | Promise<Data> | MutatorCallback<Data>,
    options?: { revalidate?: boolean },
  ) => Promise<Data | undefined>;
}

export function useSignUpRequests(config?: SWRConfiguration) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<ISignupRequest[]>("/api/signup", {
    revalidateOnFocus: false,
    ...config,
  });

  return {
    signupRequests: data,
    isLoading,
    isValidating,
    isError: error,
    mutate,
  };
}

/**
 * Hook for fetching business data by clerkId
 * If no clerkId provided, fetches authenticated user's business
 */
export function useBusiness(clerkId?: string | null, config?: SWRConfiguration) {
  const endpoint = clerkId === null ? null : clerkId ? `/api/business?clerkId=${clerkId}` : "/api/business";

  const { data, error, isLoading, isValidating, mutate } = useSWR<IBusiness>(
    endpoint,
    endpoint ? fetcher : null, // Skip fetcher if endpoint is null
    {
      revalidateOnFocus: false,
      ...config,
    },
  );

  return {
    business: data,
    isLoading,
    isValidating,
    isError: error,
    mutate,
  };
}

/**
 * Hook for fetching all businesses
 */
export function useBusinesses(config?: SWRConfiguration) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<IBusiness[]>("/api/businesses", {
    revalidateOnFocus: false,
    ...config,
  });

  return {
    businesses: data,
    isLoading,
    isValidating,
    isError: error,
    mutate,
  };
}

/**
 * Hook for fetching all requests
 */
export function useRequests(config?: SWRConfiguration) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<IRequest[]>("/api/request", {
    revalidateOnFocus: false,
    ...config,
  });

  return {
    requests: data,
    isLoading,
    isValidating,
    isError: error,
    mutate,
  };
}

/**
 * Hook for fetching request history
 */
export function useRequestHistory(config?: SWRConfiguration) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<IRequest[]>("/api/request/history", {
    revalidateOnFocus: false,
    ...config,
  });

  return {
    historyRequests: data,
    isLoading: isLoading,
    isValidating: isValidating,
    isError: error,
    mutateHistory: mutate,
  };
}

/**
 * Hook for fetching a specific request by ID
 */
export function useRequest(id: string, config?: SWRConfiguration) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<IRequest>(id ? `/api/request/${id}` : null, {
    revalidateOnFocus: false,
    ...config,
  });

  return {
    request: data,
    isLoading,
    isValidating,
    isError: error,
    mutate,
  };
}

/**
 * Hook for fetching a specific request history by ID
 */
export function useRequestHistoryById(id: string, config?: SWRConfiguration) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<IRequest>(id ? `/api/request/history/${id}` : null, {
    revalidateOnFocus: false,
    ...config,
  });

  return {
    historyItem: data,
    isLoading,
    isValidating,
    isError: error,
    mutate,
  };
}

export function useSignUpRequest(id: string, config?: SWRConfiguration) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<ISignupRequest>(id ? `/api/signup/${id}` : null, {
    revalidateOnFocus: false,
    ...config,
  });

  return {
    request: data,
    isLoading,
    isValidating,
    isError: error,
    mutate,
  };
}

/**
 * Hook for fetching current business user's active request (open)
 */
export function useActiveBusinessRequest(config?: SWRConfiguration) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<IRequest>("/api/request?status=open", {
    revalidateOnFocus: false,
    ...config,
  });

  // If we get an array from the API, take the first request (should be only one)
  const activeRequest = Array.isArray(data) ? data[0] : data;

  return {
    activeRequest,
    isLoading,
    isValidating,
    isError: error,
    mutate,
  };
}

/**
 * Utility to manually mutate cached request data
 * Useful for optimistic updates when approving/denying requests
 */
export function updateRequestStatus(
  id: string,
  status: "closed",
  decision: "approved" | "denied" | "request changes",
  cache: IRequest[],
) {
  return cache?.map((request) =>
    // Using string indexing since _id might not be in the interface but exists in MongoDB documents
    (request as any)._id === id ? { ...request, status, decision } : request,
  );
}

/**
 * Hook for fetching business data by ID
 * @param id - Business ID from MongoDB or clerkId
 * @param config - SWR configuration options
 */
export function useBusinessById(id?: string, config?: SWRConfiguration) {
  // Skip fetch if no ID is provided
  const shouldFetch = !!id;

  // Determine correct endpoint based on ID type (MongoDB ID or Clerk ID)
  const isClerkId = id?.startsWith("user_");
  const endpoint = shouldFetch ? (isClerkId ? `/api/business?clerkId=${id}` : `/api/business/${id}`) : null;

  const { data, error, isLoading, isValidating, mutate } = useSWR<IBusiness>(
    endpoint,
    endpoint ? fetcher : null, // Skip fetcher if endpoint is null
    {
      revalidateOnFocus: false,
      ...config,
    },
  );

  return {
    business: data,
    isLoading,
    isValidating,
    isError: error,
    mutate,
  };
}

export function useDates(id?: string, config?: SWRConfiguration) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<IBusiness>(`/api/business/${id}`, {
    revalidateOnFocus: false,
    ...config,
  });

  return {
    lastPaidDate: data?.lastPayDate || null,
    expiryDate: data?.membershipExpiryDate || null,
    isLoading,
    isValidating,
    isError: error,
    mutate,
  };
}

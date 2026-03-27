export function parseApiError(error, fallbackMessage = "Something went wrong") {
  if (!error) return fallbackMessage;
  return error?.response?.data?.message || error?.message || fallbackMessage;
}

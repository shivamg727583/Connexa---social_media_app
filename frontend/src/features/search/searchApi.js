
import api from "@/services/api";

export const getSearchResultsApi = (query) => {
  return api.get(`/user/search?q=${encodeURIComponent(query)}`);
};

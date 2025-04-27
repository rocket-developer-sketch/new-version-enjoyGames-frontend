import { ApiResponse } from '../models/ApiResponse';
import { RankingEntry } from '../models/Ranking';
import apiClient from '../apis/apiClient';

export const fetchRanking = async (gameType: string, top: number) => {
  const response = await apiClient.get<ApiResponse<RankingEntry[]>>(
    `/api/v1/q/scores/top?gameType=${gameType}&top=${top}`
  );
  return response.data;
};

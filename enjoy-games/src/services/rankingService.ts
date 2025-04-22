// services/rankingService.ts
import axios from 'axios';
import { ApiResponse } from '../models/ApiResponse';
import { RankingEntry } from '../models/Ranking';

export const fetchRanking = async (gameType: string, top: number) => {
  const response = await axios.get<ApiResponse<RankingEntry[]>>(
    `http://localhost:8081/api/v1/q/scores/top?gameType=${gameType}&top=${top}`
  );
  return response.data;
};

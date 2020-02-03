import { CompetitionType } from "./matches";

export interface MatchQuery {
  divisionId?: string;
  cupId?: string;
  teamId?: string;
  competitionType?: CompetitionType;
  fromMatchDate?: Date;
  toMatchDate?: Date;
  fromEntryDate?: Date;
  toEntryDate?: Date;
}
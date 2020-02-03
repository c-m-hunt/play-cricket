import { CompetitionType } from "./matches";

export interface MatchQuery {
  divisionId?: string;
  cupId?: string;
  teamId?: string;
  competitionType?: CompetitionType;
  fromEntryDate?: Date;
  toEntryDate?: Date;
}

export interface ResultQuery extends MatchQuery {
  fromMatchDate?: Date;
  toMatchDate?: Date;
}
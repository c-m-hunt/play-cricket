export interface LeagueTableResponse {
  league_table: [Table]
}

export interface Table {
  id: number
  name: string
  headings: {
    [key: string]: string
  }
  values: TableRow[]
  key: string
}

export interface TableRow {
  position: number
  team_id: number
  [key: string]: string | number
}

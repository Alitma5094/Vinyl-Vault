export interface Record {
  id: string;
  album: string;
  artist: string;
  description?: string;
  date_published?: Date;
  rpm?: string;
  coverUrl?: string;
  tracks?: Array<Track>;
  country?: string;
}

export interface Track {
  id?: string;
  title: string;
  length: {
    minuets: number;
    seconds: number;
  };
}

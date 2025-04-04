export interface CriptoDetalle{

  id:string;
  name:string;
  symbol:string;
  image: {
    small:string;
    thumb:string;
    large:string;
  };
  market_data: {
    current_price: {
      eur: number;
    };
    market_cap: {
      eur: number;
    };
    total_volume: {
      eur: number;
    };
  };
  tickers: any[];
  market_cap_rank: number;
  description: {
    en?: string;
    es?: string;
    [key: string]: string | undefined;
  }
  genesis_date?: string;
  hashing_algorithm?: string;
  links?: {
    homepage?: string[];
  }
}

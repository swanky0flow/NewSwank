export interface SearchOptions {
  limit?: number;
  minRating?: number;
  minReviews?: number;
  priceRange?: [number, number];
}

export interface Product {
  asin: string;
  name: string;
  description?: string;
  price?: number;
  image?: string;
  affiliateUrl?: string;
  rating?: number;
  reviewCount?: number;
}

export async function searchAmazonProducts(keyword: string, _options: SearchOptions = {}): Promise<Product[]> {
  // Placeholder: real implementation should call Amazon Product Advertising API (PAAPI)
  console.warn('searchAmazonProducts called in scaffold — implement PAAPI integration');
  return [];
}

export async function getProductDetails(asin: string): Promise<Product | null> {
  console.warn('getProductDetails called in scaffold — implement PAAPI integration');
  return null;
}

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Review {
  comment: string,
  date: string,
  rating: number,
  reviewerEmail: string,
  reviewerName: string,
}

export interface VehicleProduct {
  availabilityStatus: string,
  brand: string,
  category: string,
  description: string,
  dimensions: { width: number, height: number, depth: number },
  discountPercentage: number,
  id: number,
  images: string[],
  meta: { createdAt: string, updatedAt: string, barcode: string, qrCode: string }
  minimumOrderQuantity: number,
  price: number,
  rating: number,
  returnPolicy: string,
  reviews: Review[],
  shippingInformation: string,
  sku: string,
  stock: number,
  tags: string[],
  thumbnail: string,
  title: string,
  warrantyInformation: string,
  weight: number,
}

interface Response {
  total: number,
  skip: number,
  limit: number,
  products: VehicleProduct[],
}

export const queryAPI = createApi(
  {
    reducerPath: 'globalData',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://dummyjson.com' }),
    endpoints: (builder) => ({
      getProducts: builder.query<VehicleProduct[], void>({
        query: () => '/products/category/vehicle',
        transformResponse: (response: Response) => response.products,
      }),
    }),
  },
);

export const {
  useGetProductsQuery,
} = queryAPI;

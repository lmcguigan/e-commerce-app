import { Product } from '@/data/vos'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import data from '../../../data/products.json'

const mockLoading = () => new Promise((resolve) => setTimeout(resolve, 1000))

export const productsApi = createApi({
    reducerPath: 'productsApi',
    baseQuery: fetchBaseQuery({}),
    endpoints: (build) => ({
        productList: build.query<Product[], void>({
            async queryFn(){
                await mockLoading()
                return { data: data }
            }
        })
    })
})

export const { useProductListQuery } = productsApi
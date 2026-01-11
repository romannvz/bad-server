import { AsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from '@store/hooks'
import { AppDispatch, RootState } from '@store/store'
import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { WebLarekAPI } from '../../../utils/weblarek-api'

interface PaginationResult<_, U>
{
    data: U[]
    totalPages: number
    currentPage: number
    limit: number
    nextPage: () => void
    prevPage: () => void
    setPage: (page: number) => void
    setLimit: (limit: number) => void
}

interface PaginationResponse
{
    pagination: {
        totalPages: number
    }
}

type AsyncThunkConfig = {
    extra: WebLarekAPI
    state: RootState
    dispatch: AppDispatch
    rejectValue?: unknown
    serializedErrorType?: unknown
    pendingMeta?: unknown
    fulfilledMeta?: unknown
    rejectedMeta?: unknown
}

const usePagination = <T extends PaginationResponse, U>(
    asyncAction: AsyncThunk<T, Record<string, unknown>, AsyncThunkConfig>,
    selector: (state: RootState) => U[],
    defaultLimit: number
): PaginationResult<T, U> =>
{
    const dispatch = useDispatch() as AppDispatch
    const data = useSelector(selector)
    const [searchParams, setSearchParams] = useSearchParams()
    const [totalPages, setTotalPages] = useState<number>(1)

    const currentPage = Math.min(
        Number(searchParams.get('page')) || 1,
        totalPages
    )

    const limit = Number(searchParams.get('limit')) || defaultLimit

    const fetchData = useCallback(async (params: Record<string, unknown>) =>
    {
        const response = await dispatch(asyncAction(params))
        const {payload} = response as PayloadAction<T>
        if (payload?.pagination?.totalPages)
            setTotalPages(payload.pagination.totalPages)
    }, [dispatch, asyncAction])

    const updateURL = useCallback((newParams: Record<string, unknown>) =>
    {
        const updatedParams = new URLSearchParams(searchParams)
        Object.entries(newParams).forEach(([key, value]) =>
        {
            if (value !== undefined && value !== null)
                updatedParams.set(key, value.toString())
            else
                updatedParams.delete(key)
        })
        setSearchParams(updatedParams)
    }, [searchParams, setSearchParams])

    const nextPage = useCallback(() =>
    {
        if (currentPage < totalPages)
            updateURL({ page: currentPage + 1, limit })
    }, [currentPage, totalPages, limit, updateURL])

    const prevPage = useCallback(() =>
    {
        if (currentPage > 1)
            updateURL({ page: currentPage - 1, limit })
    }, [currentPage, limit, updateURL])

    const setPage = useCallback((page: number) =>
    {
        const newPage = Math.max(1, Math.min(page, totalPages))
        updateURL({ page: newPage, limit })
    }, [totalPages, limit, updateURL])

    const setLimit = useCallback((newLimit: number) =>
    {
        updateURL({ page: 1, limit: newLimit })
    }, [updateURL])

    useEffect(() =>
    {
        const params = Object.fromEntries(searchParams.entries())
        fetchData({ ...params, page: currentPage, limit }).then(() =>
        {
            if (data.length === 0 && currentPage > 1) setPage(1)
        })
    }, [currentPage, limit, searchParams, fetchData, data.length, setPage])

    return {
        data,
        totalPages,
        currentPage,
        limit,
        nextPage,
        prevPage,
        setPage,
        setLimit,
    }
}

export default usePagination
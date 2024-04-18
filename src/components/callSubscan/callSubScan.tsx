import { useState, useEffect } from 'react'
import axios, { AxiosResponse } from 'axios'

const token = process.env.NEXT_PUBLIC_SUBSCAN_TOKEN

interface SubScanCallProps {
  apiUrl: string
  requestData: Record<string, any>
}

export const useSubScanCall = <T,>({ apiUrl, requestData }: SubScanCallProps) => {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const axiosConfig = {
      method: 'post',
      url: apiUrl,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': token,
      },
      data: JSON.stringify(requestData),
    }

    axios(axiosConfig)
      .then((response: AxiosResponse<T>) => {
        setData(response.data)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
        setError('Failed to fetch data')
        setLoading(false)
      })
  }, [apiUrl, requestData])

  return { data, loading, error }
}

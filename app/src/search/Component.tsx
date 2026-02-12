'use client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useState, useEffect } from 'react'
import { useDebounce } from '@/utilities/useDebounce'
import { usePathname, useRouter } from 'next/navigation'
import { getLocaleFromPathname, withLocalePath } from '@/i18n/config'

export const Search: React.FC = () => {
  const [value, setValue] = useState('')
  const router = useRouter()
  const pathname = usePathname()
  const locale = getLocaleFromPathname(pathname)

  const debouncedValue = useDebounce(value)

  useEffect(() => {
    const target = locale ? withLocalePath('/search', locale) : '/search'
    router.push(`${target}${debouncedValue ? `?q=${debouncedValue}` : ''}`)
  }, [debouncedValue, locale, router])

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
        }}
      >
        <Label htmlFor="search" className="sr-only">
          Search
        </Label>
        <Input
          id="search"
          onChange={(event) => {
            setValue(event.target.value)
          }}
          placeholder="Search"
        />
        <button type="submit" className="sr-only">
          submit
        </button>
      </form>
    </div>
  )
}

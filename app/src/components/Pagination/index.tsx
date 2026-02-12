'use client'
import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { getLocaleFromPathname, withLocalePath } from '@/i18n/config'
import { cn } from '@/utilities/ui'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

export const Pagination: React.FC<{
  className?: string
  page: number
  totalPages: number
}> = (props) => {
  const router = useRouter()
  const pathname = usePathname()
  const locale = getLocaleFromPathname(pathname)

  const { className, page, totalPages } = props
  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1

  const hasExtraPrevPages = page - 1 > 1
  const hasExtraNextPages = page + 1 < totalPages

  return (
    <div className={cn('my-12', className)}>
      <PaginationComponent>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              disabled={!hasPrevPage}
              onClick={() => {
                const path = locale
                  ? withLocalePath(`/blogs/page/${page - 1}`, locale)
                  : `/blogs/page/${page - 1}`
                router.push(path)
              }}
            />
          </PaginationItem>

          {hasExtraPrevPages && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {hasPrevPage && (
            <PaginationItem>
              <PaginationLink
                onClick={() => {
                  const path = locale
                    ? withLocalePath(`/blogs/page/${page - 1}`, locale)
                    : `/blogs/page/${page - 1}`
                  router.push(path)
                }}
              >
                {page - 1}
              </PaginationLink>
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationLink
              isActive
              onClick={() => {
                const path = locale
                  ? withLocalePath(`/blogs/page/${page}`, locale)
                  : `/blogs/page/${page}`
                router.push(path)
              }}
            >
              {page}
            </PaginationLink>
          </PaginationItem>

          {hasNextPage && (
            <PaginationItem>
              <PaginationLink
                onClick={() => {
                  const path = locale
                    ? withLocalePath(`/blogs/page/${page + 1}`, locale)
                    : `/blogs/page/${page + 1}`
                  router.push(path)
                }}
              >
                {page + 1}
              </PaginationLink>
            </PaginationItem>
          )}

          {hasExtraNextPages && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationNext
              disabled={!hasNextPage}
              onClick={() => {
                const path = locale
                  ? withLocalePath(`/blogs/page/${page + 1}`, locale)
                  : `/blogs/page/${page + 1}`
                router.push(path)
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </PaginationComponent>
    </div>
  )
}

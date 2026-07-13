'use client'

import { useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { Upload, File as FileIcon, X, ImageIcon } from 'lucide-react'

interface FileDropzoneProps {
  id: string
  label: string
  hint?: string
  accept?: string
  multiple?: boolean
  variant?: 'image' | 'file'
}

export function FileDropzone({
  id,
  label,
  hint,
  accept,
  multiple = false,
  variant = 'file',
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<File[]>([])
  const [dragging, setDragging] = useState(false)

  function addFiles(list: FileList | null) {
    if (!list) return
    const incoming = Array.from(list)
    setFiles((prev) => (multiple ? [...prev, ...incoming] : incoming))
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const Icon = variant === 'image' ? ImageIcon : Upload

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block font-mono text-[11px] uppercase tracking-widest text-cyan"
      >
        {label}
      </label>

      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          addFiles(e.dataTransfer.files)
        }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center border border-dashed px-4 py-8 text-center transition-colors',
          dragging
            ? 'border-primary bg-primary/5'
            : 'border-border bg-card hover:border-primary/50',
        )}
      >
        <Icon className="size-6 text-cyan" />
        <p className="mt-3 text-sm text-foreground">
          Arrastra o{' '}
          <span className="text-cyan underline underline-offset-4">
            selecciona
          </span>
          {multiple ? ' archivos' : ' un archivo'}
        </p>
        {hint && (
          <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {hint}
          </p>
        )}
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {files.length > 0 && (
        <ul className="mt-2 space-y-1.5">
          {files.map((file, i) => (
            <li
              key={`${file.name}-${i}`}
              className="flex items-center justify-between gap-3 border border-border bg-background px-3 py-2"
            >
              <span className="flex min-w-0 items-center gap-2">
                <FileIcon className="size-3.5 shrink-0 text-cyan" />
                <span className="truncate font-mono text-xs text-foreground">
                  {file.name}
                </span>
                <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                  {(file.size / 1024).toFixed(0)} KB
                </span>
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  removeFile(i)
                }}
                className="shrink-0 text-muted-foreground hover:text-destructive"
                aria-label={`Quitar ${file.name}`}
              >
                <X className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

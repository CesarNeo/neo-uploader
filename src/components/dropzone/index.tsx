'use client'

import Image from 'next/image'
import { Children, useCallback, useState } from 'react'
import { type FileRejection, useDropzone } from 'react-dropzone'
import { toast } from 'sonner'

import { deleteImageAction } from '@/actions/delete-image'
import { pinata } from '@/lib/pinata'

import DeleteFileButton from '../delete-file-button'
import { Button } from '../ui/button'
import type { IDropzoneFiles } from './types'

const MAX_FILES = 5
const MAX_5_MB_FILE_SIZE = 1024 * 1024 * 5 // 5MB

function Dropzone() {
  const [filesState, setFilesState] = useState<IDropzoneFiles[]>([])

  async function uploadFile(file: File) {
    try {
      setFilesState((prevFiles) =>
        prevFiles.map((prevFile) => {
          if (prevFile.file === file) {
            return { ...prevFile, uploading: true }
          }

          return prevFile
        }),
      )

      const keyRequest = await fetch('/api/key')
      const { JWT } = await keyRequest.json()
      const upload = await pinata.upload.file(file).key(JWT)

      setFilesState((prevFiles) =>
        prevFiles.map((prevFile) => {
          if (prevFile.file === file) {
            return { ...prevFile, uploading: false, id: upload.id }
          }

          return prevFile
        }),
      )

      toast.success(`File: ${upload.name} uploaded successfully`)
    } catch (error) {
      console.log(error)

      setFilesState((prevFiles) =>
        prevFiles.map((prevFile) => {
          if (prevFile.file === file) {
            return { ...prevFile, uploading: false }
          }

          return prevFile
        }),
      )

      toast.error('Something went wrong')
    }
  }

  async function handleDeleteFile(fileName: string, fileId?: string) {
    if (fileId) {
      const result = await deleteImageAction(fileId)

      if (result.success) {
        setFilesState((prevFiles) =>
          prevFiles.filter((file) => file.id !== fileId),
        )

        toast.success(`File: ${fileName} deleted successfully`)
        return
      }

      toast.error('Something went wrong')
    }
  }

  const onDrop = useCallback((files: File[]) => {
    if (files.length >= 1) {
      const newFiles = files.map((file) => ({ file, uploading: false }))

      setFilesState((prevFiles) => [...prevFiles, ...newFiles])

      files.forEach(uploadFile)
    }
  }, [])

  const rejectedFiles = useCallback((fileRejection: FileRejection[]) => {
    if (fileRejection.length >= 1) {
      const tooManyFiles = fileRejection.find(
        (rejection) => rejection.errors[0].code === 'too-many-files',
      )
      const tooLargeFiles = fileRejection.find(
        (rejection) => rejection.errors[0].code === 'file-too-large',
      )

      if (tooManyFiles) {
        toast.error('You can only upload 5 files at a time')
      }

      if (tooLargeFiles) {
        toast.error('You can only upload files up to 5MB')
      }
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected: rejectedFiles,
    maxFiles: MAX_FILES,
    maxSize: MAX_5_MB_FILE_SIZE,
    accept: {
      'image/*': [],
    },
  })

  return (
    <>
      <div
        {...getRootProps({
          className: 'p-16 mt-10 border-dashed rounded-lg border-2 w-full',
        })}
      >
        <input {...getInputProps()} />

        {isDragActive ? (
          <p className="text-center">Drop the files here...</p>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <p>
              Drag &apos;n&apos; drop some files here, or click to select files
            </p>
            <Button>Select Files</Button>
          </div>
        )}
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {Children.toArray(
          filesState.map(({ id, file, uploading }) => (
            <div className="group relative w-full" key={id}>
              <div className="relative">
                {uploading ? (
                  <div className="size-32 animate-pulse rounded-lg bg-muted-foreground/25" />
                ) : (
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    width={200}
                    height={200}
                    className="size-32 rounded-lg object-cover"
                  />
                )}
              </div>

              <form
                action={() => handleDeleteFile(file.name, id)}
                className="absolute right-2 top-2 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              >
                <DeleteFileButton />
              </form>

              <p className="truncate text-sm text-muted-foreground">
                {file.name}
              </p>
            </div>
          )),
        )}
      </div>
    </>
  )
}

export default Dropzone

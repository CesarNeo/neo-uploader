import Dropzone from '@/components/dropzone'

function Home() {
  // const [file, setFile] = useState<File>()
  // const [uploading, setUploading] = useState(false)

  // async function uploadFile() {
  //   if (!file) {
  //     alert('No file selected')
  //     return
  //   }

  //   try {
  //     setUploading(true)
  //     const keyRequest = await fetch('/api/key')
  //     const keyData = await keyRequest.json()
  //     const upload = await pinata.upload.file(file).key(keyData.JWT)
  //     console.log(upload)
  //     setUploading(false)
  //   } catch (e) {
  //     console.log(e)
  //     setUploading(false)
  //     alert('Trouble uploading file')
  //   }
  // }

  // function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
  //   setFile(e.target?.files?.[0])
  // }

  return (
    <main className="mx-auto flex min-h-dvh w-dvw max-w-xl flex-col items-center justify-center">
      <h1 className="text-5xl font-bold">
        <span className="text-primary">Neo</span>Uploader
      </h1>

      <Dropzone />
    </main>
  )
}

export default Home

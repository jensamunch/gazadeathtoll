import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default async function AdminPage() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Admin Upload</h1>
      <form className="space-y-3" action="/api/upload" method="post" encType="multipart/form-data">
        <Input name="file" type="file" accept=".csv" />
        <Button type="submit">Upload CSV</Button>
      </form>
      <p className="text-sm text-gray-500">Upload a CSV to seed/replace the dataset.</p>
    </div>
  )
}

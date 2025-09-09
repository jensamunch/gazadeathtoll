type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function UploadSuccessPage(props: { searchParams: SearchParams }) {
  const sp = await props.searchParams
  const ok = sp.ok === 'true'
  const table = (sp.table as string) || null
  const count = sp.count ? Number(sp.count) : null
  const error = (sp.error as string) || null

  const payload = ok ? { ok, table, count } : { ok, error }

  return (
    <div className="space-y-4 p-6">
      <h1 className="text-2xl font-semibold">Upload result</h1>
      <pre className="overflow-auto rounded bg-gray-100 p-4 text-sm whitespace-pre-wrap text-gray-800 dark:bg-gray-800 dark:text-gray-100">
        {JSON.stringify(payload, null, 2)}
      </pre>
    </div>
  )
}

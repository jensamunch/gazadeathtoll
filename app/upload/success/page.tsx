type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function UploadSuccessPage(props: { searchParams: SearchParams }) {
  const sp = await props.searchParams
  const ok = sp.ok === 'true'
  const table = (sp.table as string) || null
  const count = sp.count ? Number(sp.count) : null
  const error = (sp.error as string) || null

  const payload = ok
    ? { ok, table, count }
    : { ok, error }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Upload result</h1>
      <pre className="text-sm bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-4 rounded overflow-auto whitespace-pre-wrap">
        {JSON.stringify(payload, null, 2)}
      </pre>
    </div>
  )
}



export default async function WhoAmIPage() {
  const info = {
    auth: 'disabled',
    timestamp: new Date().toISOString(),
  }

  return (
    <div className="space-y-4 p-6">
      <h1 className="text-2xl font-semibold">Who am I</h1>
      <pre className="overflow-auto rounded bg-gray-100 p-4 text-sm whitespace-pre-wrap text-gray-800 dark:bg-gray-800 dark:text-gray-100">
        {JSON.stringify(info, null, 2)}
      </pre>
    </div>
  )
}

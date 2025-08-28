export default async function WhoAmIPage() {
  const info = {
    auth: 'disabled',
    timestamp: new Date().toISOString()
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Who am I</h1>
      <pre className="text-sm bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-4 rounded overflow-auto whitespace-pre-wrap">
        {JSON.stringify(info, null, 2)}
      </pre>
    </div>
  )
}



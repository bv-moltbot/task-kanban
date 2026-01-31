export const metadata = {
  title: 'Task Kanban',
  description: 'Task management with Next.js and PocketBase',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

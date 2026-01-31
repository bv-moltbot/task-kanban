import { NextRequest, NextResponse } from 'next/server'
import pb from '@/lib/pocketbase'

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  const { id } = await context.params
  try {
    const authCookie = request.cookies.get('pb_auth')
    if (!authCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    pb.authStore.save(authCookie.value, null)
    const data = await request.json()

    const record = await pb.collection('tasks').update(id, {
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      column: data.column
    })

    return NextResponse.json({ success: true, item: record })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  const { id } = await context.params
  try {
    const authCookie = request.cookies.get('pb_auth')
    if (!authCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    pb.authStore.save(authCookie.value, null)
    await pb.collection('tasks').delete(id)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

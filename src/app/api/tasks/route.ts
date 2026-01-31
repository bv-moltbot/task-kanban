import { NextRequest, NextResponse } from 'next/server'
import pb from '@/lib/pocketbase'

export async function GET(request: NextRequest) {
  try {
    const authCookie = request.cookies.get('pb_auth')
    if (!authCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    pb.authStore.save(authCookie.value, null)
    const records = await pb.collection('tasks').getList(1, 50)

    return NextResponse.json({ 
      success: true, 
      items: records.items as any[],
      totalItems: records.totalItems 
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch tasks' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authCookie = request.cookies.get('pb_auth')
    if (!authCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    pb.authStore.save(authCookie.value, null)
    const data = await request.json()

    const record = await pb.collection('tasks').create({
      title: data.title,
      description: data.description || '',
      status: data.status || 'todo',
      priority: data.priority || 'medium',
      column: data.column || 'todo'
    })

    return NextResponse.json({ success: true, item: record })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

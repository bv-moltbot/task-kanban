import { NextRequest, NextResponse } from 'next/server'
import pb from '@/lib/pocketbase'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    const authData = await pb.collection('_superusers').authWithPassword(
      email,
      password
    )

    const response = NextResponse.json({ 
      success: true, 
      token: authData.token,
      record: authData.record 
    })

    response.cookies.set('pb_auth', authData.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/'
    })

    return response
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Authentication failed' },
      { status: 401 }
    )
  }
}

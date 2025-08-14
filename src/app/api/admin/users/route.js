import { NextResponse } from 'next/server';
import { getAllUsers } from '../../../lib/db';

export async function GET() {
  try {
    const users = getAllUsers();
    
    // Remove passwords from response for security
    const safeUsers = users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    }));

    return NextResponse.json({
      count: safeUsers.length,
      users: safeUsers,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}



import Blog from '@/schema/blog';
import '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const blogs = await Blog.find({}).sort({ createdAt: -1 }).lean();
  return NextResponse.json(blogs);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const blog = await Blog.create(data);
  return NextResponse.json(blog, { status: 201 });
}

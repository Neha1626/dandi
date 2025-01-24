import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    const { error } = await supabase
      .from('api_key')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting API key:', error);
    return NextResponse.json(
      { error: 'Failed to delete API key' },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('api_key')
      .update({ name: body.name })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating API key:', error);
    return NextResponse.json(
      { error: 'Failed to update API key' },
      { status: 500 }
    );
  }
} 
import { NextRequest, NextResponse } from 'next/server';
import { generateMarkdown } from '@/utils/generateMarkdown';
import { formDataSchema } from '@/lib/validation/schemas';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = formDataSchema.parse(body);
    
    const markdown = generateMarkdown(validatedData);
    
    return NextResponse.json({ 
      success: true, 
      markdown,
      filename: 'README.md'
    });
  } catch (error) {
    console.error('Errore nella generazione del README:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Errore interno del server' 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Endpoint per la generazione del README. Usa POST per generare il markdown.' 
  });
}

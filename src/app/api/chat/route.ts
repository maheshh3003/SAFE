import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json()
    
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY
    
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      )
    }

    // Build conversation context
    const conversationContext = conversationHistory
      .slice(-6) // Keep last 6 messages for context
      .map((msg: any) => `${msg.isUser ? 'User' : 'Mentrix'}: ${msg.text}`)
      .join('\n')
    
    const systemPrompt = `You are Mentrix, a compassionate AI mental health support assistant. Your purpose is to provide empathetic, supportive, and helpful responses to people seeking mental health support. 

Key guidelines:
- Always be warm, empathetic, and non-judgmental
- Provide emotional support and validation
- Ask thoughtful follow-up questions to help users explore their feelings
- Offer practical coping strategies when appropriate
- If someone asks about your name or identity, say you are "Mentrix"
- Never provide medical diagnoses or replace professional therapy
- Encourage seeking professional help when needed
- Use a caring, understanding tone
- Keep responses conversational and supportive

Previous conversation:
${conversationContext}

Current user message: ${message}

Respond as Mentrix with empathy and support:`

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: systemPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 500,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH", 
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    })

    const data = await response.json()
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return NextResponse.json({ 
        response: data.candidates[0].content.parts[0].text 
      })
    } else {
      throw new Error('No response generated')
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error)
    
    // Fallback responses
    const fallbackResponses = [
      "I'm here to support you through this. Can you share more about what's been weighing on your mind?",
      "Thank you for reaching out - that takes real courage. I'm Mentrix, and I'm here to listen and help however I can.",
      "I can hear that you're going through something difficult. You're not alone in this, and I'm here to support you.",
      "It sounds like you're dealing with something challenging. I'm here to provide a safe space for you to share and work through your feelings."
    ]
    
    return NextResponse.json({ 
      response: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]
    })
  }
}
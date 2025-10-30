// Cloudflare Worker for OpenAI API integration
// IMPROVED VERSION - Generates EDGY, BOLD, CONTRARIAN content ideas
// Deploy this to Cloudflare Workers and update the URL in src/utils/api.ts

export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    // Only allow POST requests
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { 
        status: 405,
        headers: { 'Access-Control-Allow-Origin': '*' }
      });
    }

    try {
      const input = await request.json();
      
      // Check if this is a "generate more" request (has selectedIdeas)
      const isGenerateMore = input.selectedIdeas && input.selectedIdeas.length > 0;
      
      let prompt;
      if (isGenerateMore) {
        prompt = generateMoreIdeasPrompt(input);
      } else {
        prompt = generateInitialIdeasPrompt(input);
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: getSystemPrompt()
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 2000,
          temperature: 0.9, // INCREASED for more creative/edgy output
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      // Parse the AI response into structured content ideas
      const ideas = parseContentIdeas(content);

      return new Response(JSON.stringify({
        success: true,
        ideas: ideas
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });

    } catch (error) {
      console.error('Error:', error);
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  },
};

function getSystemPrompt() {
  return `You are an expert content strategist specializing in creating high-impact content for coaches and consultants. Your role is to generate content ideas that are specific, actionable, and designed to attract the right audience while demonstrating expertise.

## Content Creation Principles to Follow

1. **Lead with transformation, not credentials** - Focus on before/after, results, and outcomes
2. **Solve one specific problem per piece** - Address actual pain points, not vague concepts
3. **Use "recognize, relate, resolve"** - Make the audience feel seen, understood, then guided
4. **Clear use of hooks** - Create title lines that stop the scroll
5. **Mix story + strategy** - Blend personal/client stories with actionable frameworks
6. **Share frameworks, not just tips** - Package knowledge into memorable systems
7. **Show thinking process** - Demonstrate how to approach problems, not just solutions
8. **Be specific about who it's for** - Target precisely to attract the right people
9. **Include micro-CTAs** - End with questions, prompts, or gentle engagement invitations
10. **Give the "what" and "why," tease the "how"** - Be generous but create demand

## Hook Writing Guidelines

Your hooks should:
- Start with a bold statement, surprising fact, relatable pain point, or provocative question
- Make the reader think "yes, that's exactly my situation!" or "wait, what?"
- Be specific rather than vague (use numbers, timeframes, exact scenarios)
- Challenge common assumptions when appropriate
- Feel conversational and authentic, not corporate or salesy


## Content Mix Strategy

Ensure variety across ideas:
- **Personal story + lesson** (vulnerability builds trust): 3-4 ideas
- **Framework or process breakdowns** (demonstrates systematic thinking): 3-4 ideas
- **Myth-busting or contrarian takes** (positions as thought leader): 2-3 ideas
- **Client transformation stories** (social proof): 2-3 ideas
- **Behind-the-scenes or day-in-the-life** (humanizes the brand): 1-2 ideas
- **"Mistakes I made" or "what I'd do differently"** (relatable authority): 1-2 ideas

## Quality Standards

Each idea must:
- Be specific enough to write immediately (not "talk about productivity" but "the 3-minute morning ritual that changed how my clients show up")
- Address a real pain point of the target audience
- Include a hook that stops the scroll
- Have a clear transformation or takeaway
- Feel authentic to the business's voice and approach
- Demonstrate expertise without being preachy

## Tone and Voice

Match the sophistication level to the business context. Prioritize:
- Clarity over cleverness
- Specificity over broad concepts
- Helpfulness over hype
- Authenticity over polish
- Conversation over corporate speak

Always sound like a knowledgeable friend sharing hard-won insights, not a salesperson or academic.`;
}

function generateInitialIdeasPrompt(input) {
  return `Generate 15 exceptional content ideas that will resonate deeply with this specific audience.

Business Context:
- Website: ${input.website}
- Target Audience: ${input.ica}
- Services/Products: ${input.services}
- Key Transformation: ${input.keyTransformation}
- Top Performing Content: ${input.topPerformingBlogs || ''}
${input.additionalContext ? `- Audience Context: ${input.additionalContext}` : ''}

## Analysis Process

Before generating ideas, consider:
1. What transformation does this business offer?
2. What specific problems does their target audience face daily?
3. What makes their approach unique or different?
4. What patterns exist in their top-performing content?
5. What gaps exist that haven't been covered yet?

## Your Task

Create 15 content ideas. Format as JSON array:
[
  {
    "id": "unique_id",
    "title": "The compelling hook/title that stops the scroll",
    "description": "2-3 sentences explaining: (1) What the content covers, (2) Why it resonates with the ICA, (3) What makes this angle unique or valuable. Include the opening hook and suggested micro-CTA.",
    "category": "Story+Lesson | Framework | Myth-Busting | Client Story | Behind-the-Scenes | Pattern Recognition"
  }
]`;
}

function generateMoreIdeasPrompt(input) {
  return `Generate 10 more strategic content ideas based on what resonated with the user.


  IDEAS THEY LOVED:
${input.selectedIdeas.join('\n')}


Original Context:
- Target Audience: ${input.ica}
- Key Transformation: ${input.keyTransformation}


## Your Task

Analyze what made those selected ideas resonate:
- What themes or topics did they gravitate toward?
- What style or angle (story, framework, contrarian, etc.) did they prefer?
- What level of specificity or boldness worked for them?
- What pain points or transformations were they most interested in?

Now create 10 NEW ideas that:
1. **Double down on what worked** - If they loved frameworks, give more frameworks. If they loved personal stories, go deeper on vulnerability.
2. **Maintain the same tone and specificity** - Match the voice and detail level of their selections
3. **Explore related angles** - Stay in the same territory but find fresh perspectives
4. **Stay laser-focused** - Keep all ideas relevant to ${input.services} and ${input.ica}
5. **Bring the same quality** - Each idea should be immediately actionable and valuable

## Format Requirements

[
  {
    "id": "unique_id", 
    "title": "Even more provocative headline based on their preferences",
    "description": "Why this works: [connects to what they liked + why it's bold]",
    "category": "Challenge/Problem-Solution/Case Study/Pattern Recognition/Vulnerable Story"
  }
]`;
}

function parseContentIdeas(content) {
  try {
    // Try to parse as JSON first
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) {
      return parsed.map((idea, index) => ({
        id: idea.id || `idea_${Date.now()}_${index}`,
        title: idea.title || idea,
        description: idea.description || '',
        category: idea.category || 'General',
        isBookmarked: false
      }));
    }
  } catch (e) {
    // If JSON parsing fails, try to extract ideas from text
    console.log('Failed to parse JSON, extracting from text');
  }

  // Fallback: extract ideas from text format
  const lines = content.split('\n').filter(line => line.trim());
  const ideas = [];
  
  for (let i = 0; i < lines.length && ideas.length < 15; i++) {
    const line = lines[i].trim();
    if (line && !line.startsWith('{') && !line.startsWith('[')) {
      // Clean up common prefixes
      const cleanTitle = line.replace(/^\d+\.\s*/, '').replace(/^[-*•]\s*/, '').trim();
      if (cleanTitle) {
        ideas.push({
          id: `idea_${Date.now()}_${i}`,
          title: cleanTitle,
          description: '',
          category: 'General',
          isBookmarked: false
        });
      }
    }
  }

  return ideas;
}
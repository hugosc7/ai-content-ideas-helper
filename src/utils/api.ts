import { ContentInput, ApiResponse } from '../types';

const CLOUDFLARE_WORKER_URL = 'https://ai-content-ideas-helper-api.hugo-3ec.workers.dev'; // Replace with your actual Cloudflare Worker URL

export const generateContentIdeas = async (input: ContentInput): Promise<ApiResponse> => {
  try {
    const response = await fetch(CLOUDFLARE_WORKER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating content ideas:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
};

export const generateMoreIdeas = async (input: ContentInput, selectedIdeas: string[]): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${CLOUDFLARE_WORKER_URL}/generate-more`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...input,
        selectedIdeas
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating more ideas:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
};

import { WebsiteData } from '../types';

export const extractWebsiteData = async (url: string): Promise<WebsiteData | null> => {
  try {
    // Validate URL
    if (!url || !isValidUrl(url)) {
      throw new Error('Invalid URL provided');
    }

    console.log('🔍 Extracting data from:', url);

    // Use Microlink API for website metadata extraction
    const microlinkUrl = `https://api.microlink.io/data?url=${encodeURIComponent(url)}`;
    console.log('📡 Microlink API URL:', microlinkUrl);
    
    const response = await fetch(microlinkUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch website data: ${response.status}`);
    }

    const data = await response.json();
    console.log('📊 Raw Microlink API response:', data);
    
    if (!data.data) {
      throw new Error('No data received from website');
    }

    // Extract relevant information
    const extractedData: WebsiteData = {
      title: data.data.title || '',
      description: data.data.description || '',
      image: data.data.image?.url || '',
      author: data.data.author || '',
      publisher: data.data.publisher || '',
      date: data.data.date || '',
      lang: data.data.lang || '',
      logo: data.data.logo?.url || '',
      url: data.data.url || url
    };

    // Try to fetch full page plain text using Jina Reader (cross-origin friendly)
    try {
      const jinaUrl = `https://r.jina.ai/${url}`;
      console.log('📰 Jina Reader URL:', jinaUrl);
      const textResponse = await fetch(jinaUrl);
      if (textResponse.ok) {
        const text = await textResponse.text();
        if (text && text.trim()) {
          extractedData.contentText = text.trim();
        }
      } else {
        console.warn('Jina Reader fetch failed:', textResponse.status);
      }
    } catch (e) {
      console.warn('Jina Reader error:', e);
    }

    console.log('✨ Processed website data:', extractedData);
    return extractedData;
  } catch (error) {
    console.error('❌ Website extraction error:', error);
    return null;
  }
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const formatWebsiteDataForAI = (websiteData: WebsiteData): string => {
  if (!websiteData) return '';

  const sections = [];
  
  if (websiteData.title) {
    sections.push(`Website Title: ${websiteData.title}`);
  }
  
  if (websiteData.description) {
    sections.push(`Website Description: ${websiteData.description}`);
  }
  
  if (websiteData.publisher) {
    sections.push(`Publisher/Brand: ${websiteData.publisher}`);
  }
  
  if (websiteData.author) {
    sections.push(`Author: ${websiteData.author}`);
  }
  
  if (websiteData.lang) {
    sections.push(`Language: ${websiteData.lang}`);
  }

  if (websiteData.contentText) {
    // Cap the text to avoid overwhelming the prompt
    const MAX_CHARS = 2000;
    const excerpt = websiteData.contentText.length > MAX_CHARS
      ? `${websiteData.contentText.slice(0, MAX_CHARS)}…`
      : websiteData.contentText;
    sections.push(`Website Text Excerpt:\n${excerpt}`);
  }

  return sections.length > 0 
    ? `\n\nExtracted Website Data:\n${sections.join('\n')}`
    : '';
};

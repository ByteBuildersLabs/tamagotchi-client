const CHAT_API_BASE_URL = 'https://babybeasts.up.railway.app';

interface ChatMessage {
  user: string;
  text: string;
  action?: string;
}

interface ChatResponse {
  user: string;
  text: string;
  action: string;
}

export type ChatAgent = 'Solarius' | 'Foxling' | 'WolfPup';

export class ChatService {
  static async sendMessage(message: string, userId: string = "user", agent: ChatAgent = "Solarius"): Promise<string> {
    try {
      const response = await fetch(`${CHAT_API_BASE_URL}/${agent}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: message,
          userId: userId,
          userName: "User"
        })
      });
      
      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }

      const rawData = await response.text();
      const data: ChatResponse[] = rawData ? JSON.parse(rawData) : [];
      const firstMessage = data[0];
      
      if (!firstMessage || !firstMessage.text) {
        throw new Error('No response found in API response');
      }

      return firstMessage.text;
      
    } catch (error) {
      console.error('Error calling chat API:', error);
      
      // Fallback responses if API fails
      const fallbackResponses = [
        "Lo siento, tengo problemas de conexión. ¿Puedes intentar de nuevo? 🔄",
        "Disculpa, no pude procesar tu mensaje en este momento. 😅",
        "¡Ups! Algo salió mal. ¿Podrías repetir tu pregunta? 🤔"
      ];
      
      return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    }
  }

  static getAgentForBeastType(beastType?: string): ChatAgent {
    switch (beastType?.toLowerCase()) {
      case 'wolf':
        return 'WolfPup';
      case 'dragon':
        return 'Solarius';
      case 'snake':
        return 'Foxling';
      default:
        return 'Solarius';
    }
  }
} 
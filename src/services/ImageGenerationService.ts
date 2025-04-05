import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = import.meta.env.VITE_GOOGLE_AI_API_KEY;

const GENERATION_CONFIG = {
  temperature: 0.9,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
};

class ImageGenerationService {
  private static instance: ImageGenerationService;
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;
  private chatSession: any = null;

  private constructor() {
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }
    this.genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    this.initializeModel();
  }

  private initializeModel() {
    if (!this.genAI) return;

    this.model = this.genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp-image-generation",
    });

    this.chatSession = this.model.startChat({
      generationConfig: GENERATION_CONFIG,
      history: [],
    });
  }

  public static getInstance(): ImageGenerationService {
    if (!ImageGenerationService.instance) {
      ImageGenerationService.instance = new ImageGenerationService();
    }
    return ImageGenerationService.instance;
  }

  private extractImageUrl(text: string): string {
    console.log('Attempting to extract URL from:', text);

    // Try to find markdown image syntax
    const markdownMatch = text.match(/!\[.*?\]\((.*?)\)/);
    if (markdownMatch) return markdownMatch[1];

    // Try to find a direct URL
    const urlMatch = text.match(/https?:\/\/[^\s<>"]+?\.(?:jpg|jpeg|gif|png|webp)/i);
    if (urlMatch) return urlMatch[0];

    // Try to find a base64 image
    const base64Match = text.match(/data:image\/[^;]+;base64,[^"'\s]+/i);
    if (base64Match) return base64Match[0];

    // Try to parse JSON response
    try {
      // Look for any JSON-like structure in the text
      const jsonMatches = text.match(/\{[^{}]*\}/g);
      if (jsonMatches) {
        for (const match of jsonMatches) {
          const data = JSON.parse(match);
          if (data.url) return data.url;
          if (data.image_url) return data.image_url;
          if (data.imageUrl) return data.imageUrl;
        }
      }
    } catch (e) {
      console.log('JSON parsing attempt failed:', e);
    }

    throw new Error('No valid image data found in response');
  }

  public async generateImage(prompt: string): Promise<string> {
    if (!this.chatSession) {
      throw new Error('Image generation service not initialized');
    }

    try {
      // Format the prompt to explicitly request an image
      const enhancedPrompt = `Generate an image matching this description: "${prompt}".
        The response should contain a direct image URL or a JSON object with the image URL.`;

      const result = await this.chatSession.sendMessage(enhancedPrompt);
      const response = result.response;
      const text = response.text();

      if (!text) {
        throw new Error('Empty response from the model');
      }

      console.log('Raw model response:', text);

      const imageUrl = this.extractImageUrl(text);

      // Validate the URL format
      if (!imageUrl.startsWith('http') && !imageUrl.startsWith('data:image')) {
        throw new Error('Invalid image URL format received');
      }

      return imageUrl;

    } catch (error) {
      console.error('Error in generateImage:', error);
      throw new Error('Failed to generate image. Please try again.');
    }
  }

  public async generateHeroImage(): Promise<string> {
    const prompt = `Create a hyper-realistic, professional visualization for an advanced ML Learning Platform:

    Key visual elements:
    - Ultra-detailed neural network visualization with photorealistic metallic nodes
    - Dynamic particle systems representing data flow in 3D space
    - Ray-traced global illumination with realistic light bounces
    - Premium glass and metal materials with accurate reflections
    - Depth of field effect focusing on key elements
    - Volumetric lighting through particle systems
    - High-end workstation/server room environment in background
    - 8K resolution quality textures and materials

    Lighting specifications:
    - Primary key light from top-right (blue tint)
    - Rim lighting on neural network nodes (purple accent)
    - Subtle volumetric rays through particle systems
    - Screen glow from multiple monitor displays
    - Reflective surfaces with accurate specular highlights
    - Ambient occlusion for depth and realism
    - HDR lighting with realistic exposure
    - Subtle lens flares from bright elements

    Material properties:
    - Brushed aluminum for hardware components
    - Glass/acrylic panels with accurate refraction
    - Carbon fiber textures for structural elements
    - Chrome accents with perfect reflections
    - Matte black server racks with subtle texture
    - LED strips with realistic emission
    - Polished concrete flooring with reflections
    - Premium workstation displays with anti-glare coating

    Environmental details:
    - Modern data center / research lab setting
    - Cable management with premium braided cables
    - Cooling system with subtle vapor effects
    - Status LEDs reflecting off surfaces
    - Clean, minimalist workspace organization
    - Professional monitor arrays with bezels
    - High-end workstation peripherals
    - Server racks with active status indicators

    Composition:
    - Rule of thirds with main focus on neural network
    - Leading lines through data flow particles
    - Depth through layered elements
    - Foreground, midground, background separation
    - Professional wide-aspect ratio (16:9)
    - Cinematic depth of field
    - High-end production quality
    - 8K resolution output (7680x4320)

    Style requirements:
    - Photorealistic rendering quality
    - Professional corporate aesthetic
    - High-end product visualization style
    - Perfect technical accuracy
    - Premium materials and finishes
    - Architectural visualization quality
    - Ray-traced reflections and shadows
    - Cinema-grade post-processing

    The image should convey:
    - Enterprise-level technology
    - Professional ML/AI capabilities
    - Premium quality and attention to detail
    - Technical sophistication
    - Corporate excellence
    - Innovation leadership
    - Research and development focus
    - Professional learning environment`;

    return this.generateImage(prompt);
  }
}

const imageGenerationService = ImageGenerationService.getInstance();

export const generateImage = (prompt: string) => imageGenerationService.generateImage(prompt);
export const generateHeroImage = () => imageGenerationService.generateHeroImage();

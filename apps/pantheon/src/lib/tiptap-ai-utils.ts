// import type { TextAction, TextOptions, Language, Tone } from '@tiptap-pro/extension-ai';

// /**
//  * 语言代码到语言名称的映射
//  */
// const LANGUAGE_NAMES: Partial<Record<Language, string>> = {
//   en: 'English',
//   zh: 'Chinese',
//   ja: 'Japanese',
//   ko: 'Korean',
//   es: 'Spanish',
//   fr: 'French',
//   de: 'German',
//   it: 'Italian',
//   pt: 'Portuguese',
//   ru: 'Russian',
//   ar: 'Arabic',
//   hi: 'Hindi',
//   th: 'Thai',
//   vi: 'Vietnamese',
//   nl: 'Dutch',
//   pl: 'Polish',
//   tr: 'Turkish',
//   sv: 'Swedish',
//   da: 'Danish',
//   fi: 'Finnish',
//   no: 'Norwegian',
//   cs: 'Czech',
//   el: 'Greek',
//   he: 'Hebrew',
//   id: 'Indonesian',
//   ms: 'Malay',
//   ro: 'Romanian',
//   uk: 'Ukrainian',
//   hu: 'Hungarian',
//   bg: 'Bulgarian',
//   hr: 'Croatian',
//   sk: 'Slovak',
//   sl: 'Slovenian',
//   lt: 'Lithuanian',
//   lv: 'Latvian',
//   et: 'Estonian',
// };

// /**
//  * 语气预设描述
//  */
// const TONE_DESCRIPTIONS: Partial<Record<Tone, string>> = {
//   default: '',
//   academic: 'Use an academic and scholarly tone, with precise terminology and formal language.',
//   business: 'Use a professional business tone, clear and direct.',
//   casual: 'Use a casual and relaxed tone, like talking to a friend.',
//   childfriendly: 'Use simple words and a friendly tone suitable for children.',
//   confident: 'Use a confident and assertive tone.',
//   conversational: 'Use a conversational tone, as if having a natural dialogue.',
//   creative: 'Use a creative and imaginative tone with vivid expressions.',
//   emotional: 'Use an emotional tone that connects with feelings.',
//   excited: 'Use an excited and enthusiastic tone.',
//   formal: 'Use a formal and polished tone.',
//   friendly: 'Use a warm and friendly tone.',
//   funny: 'Use a humorous and witty tone.',
//   humorous: 'Use a light-hearted and amusing tone.',
//   informative: 'Use an informative and educational tone.',
//   inspirational: 'Use an inspirational and motivating tone.',
//   memeify: 'Use internet meme culture style with trendy expressions.',
//   narrative: 'Use a storytelling narrative tone.',
//   objective: 'Use an objective and unbiased tone, focusing on facts.',
//   persuasive: 'Use a persuasive tone to convince the reader.',
//   poetic: 'Use a poetic and lyrical tone with beautiful expressions.',
// };

// /**
//  * 根据 action 类型获取基础指令
//  */
// function getActionInstruction(action: TextAction): string {
//   const instructions: Record<TextAction, string> = {
//     shorten: 'Shorten the following text while preserving its core meaning and key points.',
//     bloggify: 'Rewrite the following text in a blog post style, making it engaging and reader-friendly.',
//     extend: 'Expand and elaborate on the following text, adding more details and context.',
//     emojify: 'Add relevant emojis to the following text to make it more expressive.',
//     'de-emojify': 'Remove all emojis from the following text.',
//     simplify: 'Simplify the following text, using easier words and shorter sentences.',
//     rephrase: 'Rephrase the following text while maintaining its original meaning.',
//     complete: 'Complete the following text naturally.',
//     autocomplete: 'Continue writing the following text naturally.',
//     'fix-spelling-and-grammar': 'Fix any spelling and grammar errors in the following text.',
//     translate: 'Translate the following text.',
//     'adjust-tone': 'Adjust the tone of the following text.',
//     summarize: 'Summarize the following text concisely.',
//     prompt: 'Respond to the following prompt.',
//     restructure: 'Restructure the following text to improve its organization and flow.',
//     keypoints: 'Extract the key points from the following text as a bullet list.',
//     tldr: 'Provide a TL;DR (too long; didn\'t read) summary of the following text.',
//   };

//   return instructions[action] || 'Process the following text.';
// }

// /**
//  * 构建长度约束指令
//  */
// function buildLengthConstraint(textOptions: TextOptions): string {
//   if (!textOptions.textLength || !textOptions.textLengthUnit) {
//     return '';
//   }

//   const unitLabels: Record<string, string> = {
//     paragraphs: 'paragraphs',
//     words: 'words',
//     characters: 'characters',
//   };

//   const unit = unitLabels[textOptions.textLengthUnit] || textOptions.textLengthUnit;
//   return `The response should be approximately ${textOptions.textLength} ${unit}.`;
// }

// /**
//  * 构建输出格式指令
//  */
// function buildFormatInstruction(textOptions: TextOptions): string {
//   if (textOptions.format === 'rich-text') {
//     return 'Format your response as HTML. Use appropriate HTML tags like <p>, <strong>, <em>, <ul>, <li>, <h1>-<h6>, <blockquote>, etc.';
//   }
//   return 'Provide your response as plain text without any HTML or markdown formatting.';
// }

// /**
//  * 构建完整的 System Prompt
//  * @param action - Tiptap AI 动作类型
//  * @param textOptions - Tiptap TextOptions
//  * @returns 构建好的 system prompt 字符串
//  */
// export function buildSystemPrompt(action: TextAction, textOptions: TextOptions): string {
//   const parts: string[] = [];

//   // 1. 基础指令
//   parts.push(getActionInstruction(action));

//   // 2. 语气设置
//   if (textOptions.tone && textOptions.tone !== 'default') {
//     const toneDesc = TONE_DESCRIPTIONS[textOptions.tone as Tone];
//     if (toneDesc) {
//       parts.push(toneDesc);
//     } else {
//       // 自定义语气
//       parts.push(`Use a ${textOptions.tone} tone.`);
//     }
//   }

//   // 3. 语言设置 (用于翻译)
//   if (action === 'translate' && textOptions.language) {
//     const langName = LANGUAGE_NAMES[textOptions.language] || textOptions.language;
//     parts.push(`Translate the text to ${langName}.`);
//   }

//   // 4. 长度约束
//   const lengthConstraint = buildLengthConstraint(textOptions);
//   if (lengthConstraint) {
//     parts.push(lengthConstraint);
//   }

//   // 5. 输出格式
//   parts.push(buildFormatInstruction(textOptions));

//   // 6. 通用规则
//   parts.push('Do not include any explanations or meta-commentary. Only output the processed text.');

//   return parts.join('\n\n');
// }

// /**
//  * 将 Tiptap AI 请求转换为 OpenAI 兼容的消息格式
//  */
// export interface OpenAIMessage {
//   role: 'system' | 'user' | 'assistant';
//   content: string;
// }

// export interface OpenAIChatRequest {
//   model: string;
//   messages: OpenAIMessage[];
//   stream?: boolean;
//   temperature?: number;
//   max_tokens?: number;
// }

// /**
//  * 将 Tiptap 的 TextOptions 转换为 OpenAI Chat Completion 请求格式
//  * @param action - Tiptap AI 动作类型
//  * @param text - 用户输入的文本
//  * @param textOptions - Tiptap TextOptions
//  * @param modelName - 模型名称 (默认 'gpt-4o')
//  * @returns OpenAI 兼容的请求对象
//  */
// export function convertToOpenAIRequest(
//   action: TextAction,
//   text: string,
//   textOptions: TextOptions,
//   modelName: string = 'gpt-4o',
// ): OpenAIChatRequest {
//   const systemPrompt = buildSystemPrompt(action, textOptions);

//   const messages: OpenAIMessage[] = [
//     { role: 'system', content: systemPrompt },
//     { role: 'user', content: text },
//   ];

//   // 添加上下文 (如果有)
//   if (textOptions.context && textOptions.context.length > 0) {
//     const contextParts = textOptions.context.map((ctx) => {
//       if (ctx.type === 'text') {
//         return `Context: ${ctx.text}`;
//       } else if (ctx.type === 'url') {
//         return `Reference URL: ${ctx.url}`;
//       }
//       return '';
//     }).filter(Boolean);

//     if (contextParts.length > 0) {
//       messages[0].content = `${systemPrompt}\n\nAdditional context:\n${contextParts.join('\n')}`;
//     }
//   }

//   return {
//     model: modelName,
//     messages,
//     stream: textOptions.stream ?? true,
//     temperature: 0.7,
//   };
// }

// /**
//  * 解析 OpenAI SSE 流响应
//  * @param reader - ReadableStreamDefaultReader
//  * @param onChunk - 每个 chunk 的回调函数
//  */
// export async function parseOpenAIStream(
//   reader: ReadableStreamDefaultReader<Uint8Array>,
//   onChunk: (content: string) => void,
// ): Promise<string> {
//   const decoder = new TextDecoder();
//   let fullContent = '';
//   let buffer = '';

//   while (true) {
//     const { done, value } = await reader.read();
//     if (done) break;

//     buffer += decoder.decode(value, { stream: true });
//     const lines = buffer.split('\n');
//     buffer = lines.pop() || '';

//     for (const line of lines) {
//       const trimmed = line.trim();
//       if (!trimmed || trimmed === 'data: [DONE]') continue;
//       if (!trimmed.startsWith('data: ')) continue;

//       try {
//         const json = JSON.parse(trimmed.slice(6));
//         const content = json.choices?.[0]?.delta?.content;
//         if (content) {
//           fullContent += content;
//           onChunk(content);
//         }
//       } catch {
//         // 忽略解析错误
//       }
//     }
//   }

//   return fullContent;
// }

// /**
//  * 创建一个兼容 Tiptap 的 ReadableStream
//  * 将 OpenAI 的 SSE 响应转换为纯文本流
//  */
// export function createTiptapCompatibleStream(
//   openAIResponse: Response,
// ): ReadableStream<Uint8Array> {
//   const reader = openAIResponse.body?.getReader();
//   if (!reader) {
//     throw new Error('Response body is not readable');
//   }

//   const encoder = new TextEncoder();
//   const decoder = new TextDecoder();
//   let buffer = '';

//   return new ReadableStream({
//     async pull(controller) {
//       const { done, value } = await reader.read();

//       if (done) {
//         controller.close();
//         return;
//       }

//       buffer += decoder.decode(value, { stream: true });
//       const lines = buffer.split('\n');
//       buffer = lines.pop() || '';

//       for (const line of lines) {
//         const trimmed = line.trim();
//         if (!trimmed || trimmed === 'data: [DONE]') continue;
//         if (!trimmed.startsWith('data: ')) continue;

//         try {
//           const json = JSON.parse(trimmed.slice(6));
//           const content = json.choices?.[0]?.delta?.content;
//           if (content) {
//             controller.enqueue(encoder.encode(content));
//           }
//         } catch {
//           // 忽略解析错误
//         }
//       }
//     },
//     cancel() {
//       reader.cancel();
//     },
//   });
// }

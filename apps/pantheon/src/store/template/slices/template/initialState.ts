export interface TemplateState {
  templating: boolean;
  simpleValue: string;
}

export const initialTemplateState: TemplateState = {
  templating: false,
  simpleValue: 'This is a template store',
};

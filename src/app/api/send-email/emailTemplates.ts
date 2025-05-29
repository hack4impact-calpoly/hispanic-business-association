// Email templates for business and signup request notifications

// Types for template parameters
interface BusinessTemplateParams {
  businessName: string;
}
interface BusinessDeniedTemplateParams extends BusinessTemplateParams {
  denialMessage?: string;
}

// Type for each template function
interface EmailTemplate {
  subject: string;
  body: string;
}

type EmailTemplates = {
  businessApproved: (params: BusinessTemplateParams) => EmailTemplate;
  businessDenied: (params: BusinessDeniedTemplateParams) => EmailTemplate;
  signupApproved: (params: BusinessTemplateParams) => EmailTemplate;
  signupDenied: (params: BusinessTemplateParams) => EmailTemplate;
};

export const emailTemplates: EmailTemplates = {
  businessApproved: ({ businessName }) => ({
    subject: `Your business change request has been approved!`,
    body: `Hello,\n\nYour request to update information for "${businessName}" has been approved and the changes are now live.\n\nThank you for keeping your business information up to date!\n\n- Hispanic Business Association Team`,
  }),
  businessDenied: ({ businessName, denialMessage }) => ({
    subject: `Your business change request was denied`,
    body: `Hello,\n\nUnfortunately, your request to update information for "${businessName}" was denied.${denialMessage ? `\n\nReason: ${denialMessage}` : ""}\n\nIf you have questions, please contact us.\n\n- Hispanic Business Association Team`,
  }),
  signupApproved: ({ businessName }) => ({
    subject: `Your business signup has been approved!`,
    body: `Congratulations!\n\nYour signup request for "${businessName}" has been approved. You are now a member of the Hispanic Business Association.\n\nWelcome aboard!\n\n- Hispanic Business Association Team`,
  }),
  signupDenied: ({ businessName }) => ({
    subject: `Your business signup was denied`,
    body: `Hello,\n\nUnfortunately, your signup request for "${businessName}" was denied.\n\nIf you have questions or believe this was a mistake, please contact us.\n\n- Hispanic Business Association Team`,
  }),
};

interface BusinessTemplateParams {
  businessName: string;
}

interface BusinessDeniedTemplateParams extends BusinessTemplateParams {
  denialMessage?: string;
}
interface SignupDeniedTemplateParams extends BusinessTemplateParams {
  denialMessage?: string;
}

interface EmailTemplate {
  subject: string;
  body: string;
}

type EmailTemplates = {
  businessApproved: (params: BusinessTemplateParams) => EmailTemplate;
  businessDenied: (params: BusinessDeniedTemplateParams) => EmailTemplate;
  signupApproved: (params: BusinessTemplateParams) => EmailTemplate;
  signupDenied: (params: SignupDeniedTemplateParams) => EmailTemplate;
};

export const emailTemplates: EmailTemplates = {
  businessApproved: ({ businessName }) => ({
    subject: `✅ Your business update for "${businessName}" is now live`,
    body: `Hello,

We’re pleased to let you know that your recent update request for "${businessName}" has been reviewed and approved. The updated information is now live on your business profile.

If you have any questions or would like to make further changes, feel free to reach out to us at ${process.env.SMTP_FROM_EMAIL}.

Thank you for being an active member of the Hispanic Business Association!

Best regards,  
HBA Team`,
  }),

  businessDenied: ({ businessName, denialMessage }) => ({
    subject: `⚠️ Update request for "${businessName}" was not approved`,
    body: `Hello,

We’ve reviewed your request to update business information for "${businessName}", but it could not be approved at this time.${
      denialMessage
        ? `

Reason: ${denialMessage}`
        : ""
    }

Please feel free to reply to this email or contact us at ${process.env.SMTP_FROM_EMAIL} if you have any questions.

Best,  
HBA Team`,
  }),

  signupApproved: ({ businessName }) => ({
    subject: `🎉 Welcome! "${businessName}" is now an approved HBA member`,
    body: `Hi there,

We're excited to welcome "${businessName}" to the Hispanic Business Association! Your membership has been approved, and your business is now part of our growing network.

If you have questions or need help getting started, email us at ${process.env.SMTP_FROM_EMAIL}.

Warm regards,  
HBA Membership Team`,
  }),
  signupDenied: ({ businessName, denialMessage }) => ({
    subject: `❌ Your membership request for "${businessName}" could not be approved`,
    body: `Hello,

We've reviewed your request to join the Hispanic Business Association with "${businessName}", but unfortunately, it wasn't approved.${
      denialMessage
        ? `

Reason: ${denialMessage}`
        : ""
    }

If you'd like to follow up or need more details, don't hesitate to reach out at ${process.env.SMTP_FROM_EMAIL}.

Best,  
HBA Team`,
  }),
};

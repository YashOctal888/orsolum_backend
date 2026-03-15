import * as Yup from 'yup';

export const colorSchema = Yup.object().shape({
  primaryColor: Yup.string().matches(/^#(?:[0-9a-fA-F]{3,4}){1,2}$/, 'Invalid primary color format'),
  secondaryColor: Yup.string().matches(/^#(?:[0-9a-fA-F]{3,4}){1,2}$/, 'Invalid secondary color format'),
  accentColor: Yup.string().matches(/^#(?:[0-9a-fA-F]{3,4}){1,2}$/, 'Invalid accent color format'),
  backgroundColor: Yup.string().matches(/^#(?:[0-9a-fA-F]{3,4}){1,2}$/, 'Invalid background color format'),
  sidebarColor: Yup.string().matches(/^#(?:[0-9a-fA-F]{3,4}){1,2}$/, 'Invalid sidebar color format'),
  foregroundColor: Yup.string().matches(/^#(?:[0-9a-fA-F]{3,4}){1,2}$/, 'Invalid foreground color format'),
  animationVideoUrl: Yup.string().url('Invalid URL').nullable(),
  animations: Yup.object().shape({
    type: Yup.string().oneOf(['none', 'fade', 'slide', 'bounce', 'pulse'], 'Invalid animation type'),
    duration: Yup.number().positive('Duration must be positive'),
    enabled: Yup.boolean()
  })
});

const textSchema = Yup.object().shape({
  content: Yup.string(),
  position: Yup.string().oneOf(['top', 'center', 'bottom']),
  color: Yup.string().matches(/^#(?:[0-9a-fA-F]{3,4}){1,2}$/)
});

const buttonSchema = Yup.object().shape({
  position: Yup.string().oneOf(['top', 'center', 'bottom']),
  text: Yup.string(),
  bgColor: Yup.string().matches(/^#(?:[0-9a-fA-F]{3,4}){1,2}$/),
  textColor: Yup.string().matches(/^#(?:[0-9a-fA-F]{3,4}){1,2}$/),
  category: Yup.string()
});

export const homeSchema = Yup.object().shape({
  categoryThemes: Yup.array().of(
    Yup.object().shape({
      id: Yup.number().required('ID is required'),
      name: Yup.string().required('Name is required'),
      icon: Yup.string(),
      color: Yup.string(),
      gif: Yup.string().nullable(),
      gifPreview: Yup.string().nullable()
    })
  ),
  trendingPosters: Yup.array().of(
    Yup.object().shape({
      id: Yup.number().required('ID is required'),
      category: Yup.string(),
      icon: Yup.string(),
      bgColor: Yup.string()
    })
  ),
  promotionPosters: Yup.array().of(
    Yup.object().shape({
      id: Yup.number().required('ID is required'),
      imagePreview: Yup.string().nullable(),
      button: buttonSchema
    })
  ),
  featuredCampaigns: Yup.array().of(
    Yup.object().shape({
      id: Yup.number().required('ID is required'),
      imagePreview: Yup.string().nullable(),
      text: textSchema
    })
  )
});

export const posterSchema = Yup.object().shape({
  posters: Yup.array().of(
    Yup.object().shape({
      id: Yup.number().required('ID is required'),
      name: Yup.string(),
      imagePreview: Yup.string().url('Invalid URL').nullable() // URL returned from S3
    })
  ).default([])
});

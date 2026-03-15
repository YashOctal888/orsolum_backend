import ThemeSetting from "../models/ThemeSetting.js";
import { colorSchema, homeSchema, posterSchema } from "../validations/themeValidation.js";
import { catchError } from "../helper/service.js";
import { jsonStatus, status } from "../helper/api.responses.js";

const getThemeDocument = async () => {
  let theme = await ThemeSetting.findOne();
  if (!theme) {
    theme = await ThemeSetting.create({});
  }
  return theme;
};

// --------------- GET ENDPOINTS ---------------

export const getColorTheme = async (req, res) => {
  try {
    const theme = await getThemeDocument();
    return res.status(status.OK).json({
      success: true,
      status: jsonStatus.OK,
      message: "Color theme retrieved successfully",
      data: theme.color
    });
  } catch (error) {
    catchError("getColorTheme", error, req, res);
  }
};

export const getHomeTheme = async (req, res) => {
  try {
    const theme = await getThemeDocument();
    return res.status(status.OK).json({
      success: true,
      status: jsonStatus.OK,
      message: "Home theme retrieved successfully",
      data: theme.home
    });
  } catch (error) {
    catchError("getHomeTheme", error, req, res);
  }
};

export const getPosterTheme = async (req, res) => {
  try {
    const theme = await getThemeDocument();
    return res.status(status.OK).json({
      success: true,
      status: jsonStatus.OK,
      message: "Poster theme retrieved successfully",
      data: theme.posters
    });
  } catch (error) {
    catchError("getPosterTheme", error, req, res);
  }
};

// --------------- PUT ENDPOINTS ---------------

export const updateColorTheme = async (req, res) => {
  try {
    await colorSchema.validate(req.body, { abortEarly: false });
    
    const theme = await getThemeDocument();
    theme.color = { ...theme.color, ...req.body };
    await theme.save();

    return res.status(status.OK).json({
      success: true,
      status: jsonStatus.OK,
      message: "Color theme updated successfully",
      data: theme.color
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(status.BadRequest).json({
        success: false,
        status: jsonStatus.BadRequest,
        message: "Validation Error",
        errors: error.errors
      });
    }
    catchError("updateColorTheme", error, req, res);
  }
};

export const updateHomeTheme = async (req, res) => {
  try {
    await homeSchema.validate(req.body, { abortEarly: false });
    
    const theme = await getThemeDocument();
    theme.home = { ...theme.home, ...req.body };
    await theme.save();

    return res.status(status.OK).json({
      success: true,
      status: jsonStatus.OK,
      message: "Home theme updated successfully",
      data: theme.home
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(status.BadRequest).json({
        success: false,
        status: jsonStatus.BadRequest,
        message: "Validation Error",
        errors: error.errors
      });
    }
    catchError("updateHomeTheme", error, req, res);
  }
};

export const updatePosterTheme = async (req, res) => {
  try {
    await posterSchema.validate(req.body, { abortEarly: false });
    
    const theme = await getThemeDocument();
    // Payload should be { posters: [...] }
    if (req.body.posters !== undefined) {
      theme.posters = req.body.posters;
    }
    await theme.save();

    return res.status(status.OK).json({
      success: true,
      status: jsonStatus.OK,
      message: "Poster theme updated successfully",
      data: theme.posters
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(status.BadRequest).json({
        success: false,
        status: jsonStatus.BadRequest,
        message: "Validation Error",
        errors: error.errors
      });
    }
    catchError("updatePosterTheme", error, req, res);
  }
};
